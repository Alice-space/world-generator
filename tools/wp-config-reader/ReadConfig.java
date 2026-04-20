import org.pepsoft.worldpainter.Configuration;
import java.io.*;
import java.lang.reflect.*;
import java.util.*;

public class ReadConfig {
    public static void main(String[] args) throws Exception {
        if (args.length < 1) {
            System.err.println("Usage: java ReadConfig <config-file>");
            System.exit(1);
        }
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(args[0]))) {
            Object obj = ois.readObject();
            System.out.println("# WorldPainter Configuration Dump");
            System.out.println("# Class: " + obj.getClass().getName());
            System.out.println();
            dumpObject("", obj, new HashSet<>());
        }
    }

    static void dumpObject(String prefix, Object config, Set<Integer> visited) {
        if (config == null) return;
        int id = System.identityHashCode(config);
        if (visited.contains(id)) {
            System.out.println(prefix + "# <circular reference to " + config.getClass().getSimpleName() + ">");
            return;
        }
        visited.add(id);

        Class<?> clazz = config.getClass();
        while (clazz != null && clazz != Object.class) {
            for (Field field : clazz.getDeclaredFields()) {
                if (Modifier.isStatic(field.getModifiers())) continue;
                try {
                    field.setAccessible(true);
                    Object value = field.get(config);
                    System.out.println(prefix + field.getName() + ": " + formatValue(value));
                } catch (Exception e) {
                    System.out.println(prefix + field.getName() + ": <error: " + e.getMessage() + ">");
                }
            }
            clazz = clazz.getSuperclass();
        }
    }

    static String formatValue(Object v) {
        if (v == null) return "null";
        if (v instanceof String) return "\"" + ((String)v).replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
        if (v instanceof Boolean || v instanceof Number) return v.toString();
        if (v instanceof Enum) return v.toString();
        if (v instanceof File) return "\"" + v + "\"";
        if (v instanceof Collection) {
            Collection<?> col = (Collection<?>) v;
            return v.getClass().getSimpleName() + "(size=" + col.size() + ")";
        }
        if (v instanceof Map) {
            Map<?,?> map = (Map<?,?>) v;
            return v.getClass().getSimpleName() + "(size=" + map.size() + ")";
        }
        if (v.getClass().isArray()) {
            return v.getClass().getComponentType().getSimpleName() + "[" + Array.getLength(v) + "]";
        }
        // For simple value types, try toString
        String pkg = v.getClass().getPackageName();
        if (pkg.startsWith("java.") || pkg.startsWith("javax.")) {
            return v.getClass().getSimpleName() + "(" + v + ")";
        }
        return v.getClass().getSimpleName() + "(" + v + ")";
    }
}
