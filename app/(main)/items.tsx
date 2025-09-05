import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    Alert,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import Header from "@/components/header";
import { SafeAreaView } from "react-native-safe-area-context";

interface Category {
    id: number;
    name: string;
}

interface MenuItem {
    id: number;
    category_id: number;
    name: string;
    description: string;
    price: number;
    image_url?: string;
    availability: string;
    category_name?: string;
}

const ItemsManageScreen = () => {
    const db = useSQLiteContext();
    const [items, setItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [newItem, setNewItem] = useState({
        name: "",
        description: "",
        price: "",
        category_id: "",
    });

    const loadItems = async () => {
        try {
            const rows = await db.getAllAsync<MenuItem>(
                `SELECT menu_items.*, categories.name as category_name
                 FROM menu_items
                          LEFT JOIN categories ON menu_items.category_id = categories.id`
            );
            setItems(rows);
        } catch (e) {
            console.log("❌ Load items error:", e);
        }
    };

    const loadCategories = async () => {
        try {
            const rows = await db.getAllAsync<Category>('SELECT * FROM categories');
            setCategories(rows);
        } catch (e) {
            console.log("❌ Load categories error:", e);
        }
    };

    useEffect(() => {
        loadItems();
        loadCategories();
    }, []);

    const addItem = async () => {
        if (!newItem.name.trim() || !newItem.price.trim() || !newItem.category_id) {
            Alert.alert("Error", "Name, Price, and Category are required");
            return;
        }

        try {
            await db.runAsync(
                `INSERT INTO menu_items (name, description, price, category_id, availability)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    newItem.name,
                    newItem.description,
                    parseFloat(newItem.price),
                    parseInt(newItem.category_id),
                    "available",
                ]
            );
            setNewItem({ name: "", description: "", price: "", category_id: "" });
            await loadItems();
        } catch (e) {
            console.log("❌ Insert item error:", e);
            Alert.alert("Error", "Failed to add item");
        }
    };

    const deleteItem = async (id: number) => {
        try {
            await db.runAsync("DELETE FROM menu_items WHERE id = ?", [id]);
            await loadItems();
        } catch (e) {
            console.log("❌ Delete item error:", e);
        }
    };

    const toggleAvailability = async (id: number, currentStatus: string) => {
        try {
            const newStatus =
                currentStatus === "available" ? "out_of_stock" : "available";
            await db.runAsync("UPDATE menu_items SET availability = ? WHERE id = ?", [
                newStatus,
                id,
            ]);
            await loadItems();
        } catch (e) {
            console.log("❌ Update availability error:", e);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Manage Items" />
            <View style={{ padding: 12 }}>
                {/* Add New Item */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Item Name"
                        placeholderTextColor="#ccc"
                        value={newItem.name}
                        onChangeText={(text) => setNewItem({ ...newItem, name: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Description"
                        placeholderTextColor="#ccc"
                        value={newItem.description}
                        onChangeText={(text) => setNewItem({ ...newItem, description: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Price"
                        placeholderTextColor="#ccc"
                        keyboardType="numeric"
                        value={newItem.price}
                        onChangeText={(text) => setNewItem({ ...newItem, price: text })}
                    />

                    {/*<RNPickerSelect*/}
                    {/*    onValueChange={(value) => setNewItem({ ...newItem, category_id: value })}*/}
                    {/*    items={categories.map(category => ({*/}
                    {/*        label: category.name,*/}
                    {/*        value: category.id.toString(),*/}
                    {/*    }))}*/}
                    {/*    placeholder={{*/}
                    {/*        label: "Select a category...",*/}
                    {/*        value: null,*/}
                    {/*    }}*/}
                    {/*    style={pickerSelectStyles.inputIOS}*/}
                    {/*/>*/}

                    <TouchableOpacity style={styles.addButton} onPress={addItem}>
                        <Text style={styles.addButtonText}>Add Item</Text>
                    </TouchableOpacity>
                </View>

                {/* Items List */}
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.itemCard}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text>{item.description}</Text>
                                <Text>💲 {item.price.toFixed(2)}</Text>
                                <Text>📂 Category: {item.category_name || "N/A"}</Text>
                                <Text>Status: {item.availability}</Text>
                            </View>
                            <View>
                                <TouchableOpacity
                                    onPress={() => toggleAvailability(item.id, item.availability)}
                                >
                                    <Text style={styles.toggleButton}>
                                        {item.availability === "available"
                                            ? "Mark Out of Stock"
                                            : "Mark Available"}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteItem(item.id)}>
                                    <Text style={styles.deleteButton}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // To ensure text doesn't overlap with the dropdown icon
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // To ensure text doesn't overlap with the dropdown icon
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    // The placeholder style is for the text inside the picker when nothing is selected
    placeholder: {
        color: '#999',
    },
});

const styles = StyleSheet.create({
    container: { flex: 1 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
    inputContainer: { marginBottom: 20 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 8,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    addButton: {
        backgroundColor: "#2e86de",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    itemCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 12,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    itemName: { fontSize: 18, fontWeight: "600" },
    toggleButton: { color: "#2e86de", marginBottom: 8 },
    deleteButton: { color: "red" },
});

export default ItemsManageScreen;
