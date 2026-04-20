import org.pepsoft.worldpainter.Configuration;
import java.io.*;
import java.lang.reflect.*;
import java.util.*;

public class WriteConfig {
    // Map of CLI arg name -> field name
    static final Map<String, String> ARG_MAP = new LinkedHashMap<>();
    static {
        ARG_MAP.put("--check-for-updates", "checkForUpdates");
        ARG_MAP.put("--undo-enabled", "undoEnabled");
        ARG_MAP.put("--undo-levels", "undoLevels");
        ARG_MAP.put("--maximum-brush-size", "maximumBrushSize");
        ARG_MAP.put("--default-max-height", "defaultMaxHeight");
        ARG_MAP.put("--default-game-type", "defaultGameType");
        ARG_MAP.put("--default-allow-cheats", "defaultAllowCheats");
        ARG_MAP.put("--default-map-features", "defaultMapFeatures");
        ARG_MAP.put("--autosave-enabled", "autosaveEnabled");
        ARG_MAP.put("--autosave-interval", "autosaveInterval");
        ARG_MAP.put("--minimum-free-space", "minimumFreeSpaceForMaps");
        ARG_MAP.put("--default-platform-id", "defaultPlatformId");
        ARG_MAP.put("--water-level", "waterLevel");
        ARG_MAP.put("--border-level", "borderLevel");
        ARG_MAP.put("--world-file-backups", "worldFileBackups");
        ARG_MAP.put("--auto-delete-backups", "autoDeleteBackups");
        ARG_MAP.put("--default-resources-minimum-level", "defaultResourcesMinimumLevel");
        ARG_MAP.put("--autosave-delay", "autosaveDelay");
    }

    public static void main(String[] args) throws Exception {
        String output = System.getProperty("user.home") + "/.local/share/worldpainter/config";
        Map<String, String> overrides = new HashMap<>();

        for (int i = 0; i < args.length; i++) {
            if ("--output".equals(args[i]) && i + 1 < args.length) {
                output = args[++i];
            } else if (ARG_MAP.containsKey(args[i]) && i + 1 < args.length) {
                overrides.put(ARG_MAP.get(args[i]), args[++i]);
            } else if ("--help".equals(args[i])) {
                printHelp();
                return;
            }
        }

        // Create default configuration
        Configuration config;
        try {
            config = new Configuration();
            System.out.println("Created Configuration via default constructor.");
        } catch (Exception e) {
            System.err.println("Default constructor failed: " + e.getMessage());
            System.err.println("Trying getInstance()...");
            config = Configuration.getInstance();
            if (config == null) {
                // Try reflection to instantiate
                Constructor<?> ctor = Configuration.class.getDeclaredConstructor();
                ctor.setAccessible(true);
                config = (Configuration) ctor.newInstance();
            }
        }

        // Apply overrides via reflection
        int overrideCount = 0;
        for (Map.Entry<String, String> entry : overrides.entrySet()) {
            try {
                setField(config, entry.getKey(), entry.getValue());
                System.out.println("Set " + entry.getKey() + " = " + entry.getValue());
                overrideCount++;
            } catch (Exception e) {
                System.err.println("Warning: failed to set field " + entry.getKey() + ": " + e.getMessage());
            }
        }

        // Ensure output directory exists
        File outputFile = new File(output);
        File parentDir = outputFile.getParentFile();
        if (parentDir != null && !parentDir.exists()) {
            parentDir.mkdirs();
            System.out.println("Created directory: " + parentDir.getAbsolutePath());
        }

        // Serialize
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(outputFile))) {
            oos.writeObject(config);
        }
        System.out.println("Configuration written to: " + outputFile.getAbsolutePath());
        System.out.println("Applied " + overrideCount + " override(s).");
    }

    static void setField(Object obj, String fieldName, String value) throws Exception {
        Field field = findField(obj.getClass(), fieldName);
        field.setAccessible(true);
        Class<?> type = field.getType();
        if (type == boolean.class || type == Boolean.class) {
            field.set(obj, Boolean.parseBoolean(value));
        } else if (type == int.class || type == Integer.class) {
            field.set(obj, Integer.parseInt(value));
        } else if (type == long.class || type == Long.class) {
            field.set(obj, Long.parseLong(value));
        } else if (type == float.class || type == Float.class) {
            field.set(obj, Float.parseFloat(value));
        } else if (type == double.class || type == Double.class) {
            field.set(obj, Double.parseDouble(value));
        } else if (type == String.class) {
            field.set(obj, value);
        } else {
            System.err.println("Warning: unsupported type for field " + fieldName + ": " + type);
        }
    }

    static Field findField(Class<?> clazz, String name) throws NoSuchFieldException {
        Class<?> c = clazz;
        while (c != null) {
            try { return c.getDeclaredField(name); } catch (NoSuchFieldException e) {}
            c = c.getSuperclass();
        }
        throw new NoSuchFieldException("Field not found: " + name + " in " + clazz.getName());
    }

    static void printHelp() {
        System.out.println("Usage: WriteConfig [options]");
        System.out.println("Options:");
        System.out.println("  --output <path>                Output file path (default: ~/.local/share/worldpainter/config)");
        System.out.println("  --check-for-updates <bool>     Default: true (set false for headless)");
        System.out.println("  --undo-enabled <bool>          Default: true");
        System.out.println("  --undo-levels <int>            Default: 100");
        System.out.println("  --maximum-brush-size <int>     Default: 300 (use 5000 for large tiles)");
        System.out.println("  --default-max-height <int>     Default: 2032");
        System.out.println("  --default-game-type <int>      Default: 0 (Survival)");
        System.out.println("  --default-allow-cheats <bool>  Default: false");
        System.out.println("  --default-map-features <bool>  Default: true");
        System.out.println("  --autosave-enabled <bool>      Default: true (set false for batch)");
        System.out.println("  --autosave-interval <int>      Default: 600000 ms");
        System.out.println("  --minimum-free-space <int>     Default: 1 (set 0 to disable check)");
        System.out.println("  --default-platform-id <str>    Default: org.pepsoft.anvil.1.20.5");
    }
}
