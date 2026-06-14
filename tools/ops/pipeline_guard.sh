#!/bin/bash
# Pipeline guard for the 1:50 Earth map rebuild (installed 2026-06-12 by Claude).
# Runs from cron every 10 min:
#   - heartbeat (hourly) with progress + free disk
#   - restarts the tiles pipeline (idempotent — all stages skip done work) if it died
#   - STALL DETECTION: if the running pipeline's OWN log (resolved from the live
#     python child's open fds, not a global glob) has not advanced for STALL_MIN
#     minutes, it is wedged (e.g. a forkserver SemLock fork-crash hang); kill its
#     process group and restart.  This is the safeguard that was missing when a
#     hang silently burned 31h on 2026-06-13.
#   - refuses to restart when disks are critically full
# Log: ~/Documents/pipeline_guard.log
LOG=/home/alice/Documents/pipeline_guard.log
REPO=/home/alice/Documents/SSDDataDisk1T/world-generator
LOGDIR=/mnt/DataDisk14T/world-generator-50/logs
REGION=/mnt/DataDisk14T/world-generator-50/earth_1_50/region
STAMP=$(date "+%F %T")
STALL_MIN=20
RESTART_CAP=10

# Maintenance interlock: while this flag exists, the guard does nothing, so an
# operator can kill+restart the pipeline by hand without the guard racing to
# relaunch a second copy (a double instance OOM-killed itself on 2026-06-15).
[ -f /tmp/pipeline_maintenance ] && exit 0
# Single-guard lock: never let two guard invocations overlap (a slow restart
# must not let the next cron tick launch a second pipeline).
exec 9>/tmp/pipeline_guard.lock
flock -n 9 || exit 0

free_gb() { df -BG --output=avail "$1" 2>/dev/null | tail -1 | tr -dc 0-9; }

DONE=0
[ -d "$REGION" ] && DONE=$(find "$REGION" -maxdepth 1 -name ".tile_*.done" 2>/dev/null | wc -l)
SSD_FREE=$(free_gb /mnt/SSDDataDisk1T); D2_FREE=$(free_gb /mnt/DataDisk2T); D14_FREE=$(free_gb /mnt/DataDisk14T)

# The python child (not the xvfb-run sh wrapper) is the process that holds the
# log FileHandler; pgrep matches both, so pick the python one.
PYPID=""
for p in $(pgrep -f "[-]m world_generator tiles"); do
  case "$(cat /proc/$p/comm 2>/dev/null)" in python*) PYPID=$p; break;; esac
done

REASON=CRASH   # default cause if we end up restarting
if [ -n "$PYPID" ]; then
  # Resolve the log THIS process is actually writing, from its open fds.
  OPEN_LOGS=$(ls -l /proc/"$PYPID"/fd 2>/dev/null | grep -oE "/[^ ]+\.log")
  OWN_LOG=$(echo "$OPEN_LOGS" | grep -E "^${LOGDIR}/tiles_rebuild_.*\.log$" | head -1)
  STALLED=0
  if [ -n "$OWN_LOG" ]; then
    AGE=$(( $(date +%s) - $(stat -c %Y "$OWN_LOG" 2>/dev/null || echo 0) ))
    THRESH=$((STALL_MIN * 60))
    # Terminal minutor overview stage emits a 5-min heartbeat but allow extra slack
    [ "${DONE:-0}" -ge 64800 ] && THRESH=3600
    [ "$AGE" -gt "$THRESH" ] && STALLED=1
  elif [ -n "$OPEN_LOGS" ]; then
    # Process writes a non-LOGDIR log (e.g. an operator's manual generator.log
    # run) — not ours to police; leave it strictly alone.
    if [ "$(date +%M)" -lt 10 ]; then
      echo "$STAMP RUNNING(manual) done=$DONE/64800 free SSD=${SSD_FREE}G 2T=${D2_FREE}G 14T=${D14_FREE}G" >> "$LOG"
    fi
    exit 0
  else
    # No .log fd open at all: wedged before opening its log (xvfb/QGIS init
    # deadlock, or a hang during the first spawn pool).  Age off on runtime so
    # the startup blind spot is still covered.
    ETIMES=$(ps -o etimes= -p "$PYPID" 2>/dev/null | tr -d ' ')
    AGE=${ETIMES:-0}
    [ "${ETIMES:-0}" -gt $((STALL_MIN * 60)) ] && STALLED=1
  fi

  if [ "$STALLED" = "1" ]; then
    PGID=$(ps -o pgid= -p "$PYPID" | tr -d ' ')
    echo "$STAMP STALLED (no progress for ~$((AGE/60))min) — killing PGID $PGID and restarting" >> "$LOG"
    # Kill the whole process group (one shared PGID reaps the xvfb-run wrapper,
    # python, and all spawn workers).  Do NOT pkill by cmdline: that would also
    # kill a concurrent operator diagnostic run of the same module.
    [ -n "$PGID" ] && kill -9 -"$PGID" 2>/dev/null
    rm -rf /tmp/pymp-* /tmp/xvfb-run.* /tmp/.X*-lock /tmp/qt_temp-* 2>/dev/null
    sleep 5
    REASON=STALL
    # fall through to the restart block
  else
    if [ "$(date +%M)" -lt 10 ]; then
      echo "$STAMP RUNNING done=$DONE/64800 free SSD=${SSD_FREE}G 2T=${D2_FREE}G 14T=${D14_FREE}G" >> "$LOG"
    fi
    exit 0
  fi
fi

# Not running (dead), or just killed for being stalled.
if [ "${SSD_FREE:-0}" -lt 30 ] || [ "${D2_FREE:-0}" -lt 30 ] || [ "${D14_FREE:-0}" -lt 100 ]; then
  echo "$STAMP DEAD but DISK LOW (SSD=${SSD_FREE}G 2T=${D2_FREE}G 14T=${D14_FREE}G) — NOT restarting, manual action needed" >> "$LOG"
  exit 1
fi

# Count only genuine crash restarts toward the cap, so a watchdog stall-kill
# storm (should be rare now) can never disable recovery for the day.
CRASH_TODAY=$(grep -c "^$(date +%F).* RESTART\[CRASH\]" "$LOG" 2>/dev/null)
if [ "${CRASH_TODAY:-0}" -ge "$RESTART_CAP" ]; then
  echo "$STAMP DEAD, crash-restart cap reached today ($CRASH_TODAY) — giving up, inspect $LOGDIR" >> "$LOG"
  exit 1
fi

N=$(date +%m%d%H%M)
echo "$STAMP RESTART[$REASON] #$((CRASH_TODAY+1)) done=$DONE/64800 -> tiles_rebuild_$N.log" >> "$LOG"
cd "$REPO" || exit 1
nohup ./run.sh tiles -c config-50.yaml --log-file "$LOGDIR/tiles_rebuild_$N.log" > "$LOGDIR/tiles_rebuild_$N.stdout" 2>&1 &
