import Header from "@/components/header";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Button,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Item {
    id: number;
    name: string;
    price: number;
}

interface Category {
    id: number;
    name: string;
}

export default function ManageCategoriesScreen() {
    const db = useSQLiteContext();
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState("");

    const loadCategories = async () => {
        try {
            const res = await db.getAllAsync("SELECT name FROM sqlite_master WHERE type='table'");
            console.log("Tables:", res);

            const rows = await db.getAllAsync<Category>("SELECT * FROM categories");
            setCategories(rows);
        } catch (e) {
            console.log("❌ Load error:", e);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const addCategory = async () => {
        if (!name.trim()) {
            Alert.alert("Error", "Category name cannot be empty");
            return;
        }
        try {
            await db.runAsync("INSERT INTO categories (name) VALUES (?)", [name]);
            setName("");
            await loadCategories(); // refresh list
        } catch (e) {
            console.log("❌ Insert error:", e);
            Alert.alert("Error", "Failed to add category");
        }
    };

    const deleteCategory = async (id: number) => {
        try {
            await db.runAsync("DELETE FROM categories WHERE id = ?", [id]);
            await loadCategories();
        } catch (e) {
            console.log("❌ Delete error:", e);
        }
    };

    const renderCategory = ({ item }: { item: Category }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.categoryName}>{item.name}</Text>
                <TouchableOpacity onPress={() => deleteCategory(item.id)}>
                    <Text style={styles.deleteBtn}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Manage Categories" />
            <View style={{ padding: 12 }}>

                {/* Add category input */}
                <View style={styles.inputRow}>
                    <TextInput
                        placeholder="Enter category name"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                    />
                    <Button title="Add" onPress={addCategory}/>
                </View>

                <FlatList
                    data={categories}
                    renderItem={renderCategory}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginRight: 8,
        color:'#fff'
    },
    card: {
        backgroundColor: "#f9f9f9",
        padding: 12,
        marginBottom: 12,
        borderRadius: 10,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    categoryName: { fontSize: 18, fontWeight: "bold" },
    deleteBtn: { color: "red" },
});
