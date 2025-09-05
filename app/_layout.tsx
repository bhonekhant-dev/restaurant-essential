import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded) return null;

    return (
        <SQLiteProvider
            databaseName="restaurant-essential.db"  // ✅ local DB file
            onInit={async (db: SQLiteDatabase) => {
                try {
                    const DATABASE_VERSION = 1;

                    const result = await db.getFirstAsync<{ user_version: number }>(
                        "PRAGMA user_version"
                    );
                    let currentVersion = result?.user_version ?? 0;

                    if (currentVersion < DATABASE_VERSION) {
                        console.log(`Migrating DB from v${currentVersion} → v${DATABASE_VERSION}`);

                        if (currentVersion === 0) {
                            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS users (
                  id INTEGER PRIMARY KEY NOT NULL,
                  name TEXT NOT NULL,
                  phone TEXT,
                  email TEXT,
                  role TEXT NOT NULL,
                  password TEXT,
                  status TEXT DEFAULT 'active'
                );
              `);

                            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS restaurant_tables (
                  id INTEGER PRIMARY KEY NOT NULL,
                  table_number TEXT NOT NULL,
                  status TEXT DEFAULT 'vacant',
                  assigned_waiter_id INTEGER,
                  FOREIGN KEY (assigned_waiter_id) REFERENCES users(id)
                );
              `);

                            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS categories (
                  id INTEGER PRIMARY KEY NOT NULL,
                  name TEXT NOT NULL,
                  description TEXT,
                  status TEXT DEFAULT 'active'
                );
              `);

                            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS menu_items (
                  id INTEGER PRIMARY KEY NOT NULL,
                  category_id INTEGER,
                  name TEXT NOT NULL,
                  description TEXT,
                  price REAL NOT NULL,
                  image_url TEXT,
                  availability TEXT DEFAULT 'available',
                  FOREIGN KEY (category_id) REFERENCES categories(id)
                );
              `);

                            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS orders (
                  id INTEGER PRIMARY KEY NOT NULL,
                  table_id INTEGER,
                  waiter_id INTEGER,
                  status TEXT DEFAULT 'pending',
                  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                  updated_at TEXT,
                  FOREIGN KEY (table_id) REFERENCES restaurant_tables(id),
                  FOREIGN KEY (waiter_id) REFERENCES users(id)
                );
              `);

                            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS order_items (
                  id INTEGER PRIMARY KEY NOT NULL,
                  order_id INTEGER,
                  item_id INTEGER,
                  quantity INTEGER NOT NULL,
                  price REAL NOT NULL,
                  FOREIGN KEY (order_id) REFERENCES orders(id),
                  FOREIGN KEY (item_id) REFERENCES menu_items(id)
                );
              `);
                        }

                        // ✅ always update version after migration
                        await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
                    } else {
                        console.log("No migration needed, DB version:", currentVersion);
                    }
                } catch (e) {
                    console.error("DB init error:", e);
                }
            }}
        >
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="(main)" options={{ headerShown: false }} />
                    <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
            </ThemeProvider>
        </SQLiteProvider>
    );
}
