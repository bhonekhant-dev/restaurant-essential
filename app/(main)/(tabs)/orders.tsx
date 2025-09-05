import React, {useState, useMemo, useEffect} from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    FlatList,
    TextInput,
    Animated,
    Easing
} from "react-native";
import OrderItem from "@/components/OrderItem";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useIsFocused } from "@react-navigation/core";

const menu = {
    Appetizers: [
        { name: "Spinach Artichoke Dip", price: 7.99 },
        { name: "Mozzarella Sticks", price: 6.99 },
        { name: "Loaded Potato Skins", price: 8.49 },
    ],
    Entrees: [
        { name: "Grilled Salmon", price: 14.99 },
        { name: "Chicken Alfredo", price: 12.99 },
        { name: "Classic Cheeseburger", price: 11.49 },
    ],
    Beverages: [
        { name: "Soft Drinks", price: 2.99 },
        { name: "Iced Tea", price: 3.49 },
        { name: "Craft Beer", price: 4.99 },
    ],
};

const Orders = () => {
    const db = useSQLiteContext();
    const isFocused = useIsFocused();
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const router = useRouter();
    const [showCategories, setShowCategories] = useState(false);
    // The type for categories should be an array of objects
    const [categories,setCategories] = useState<any[]>([]);

    const [animation] = useState(new Animated.Value(0));

    const toggleCategories = () => {
        const toValue = showCategories ? 0 : 1;

        Animated.timing(animation, {
            toValue,
            duration: 150,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
        }).start();

        setShowCategories(!showCategories);
    };

    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [-20, 0]
    });

    const opacity = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
    });

    const handleIncrease = (name: string) => {
        setQuantities((prev) => ({ ...prev, [name]: (prev[name] || 0) + 1 }));
    };

    const handleDecrease = (name: string) => {
        setQuantities((prev) => ({
            ...prev,
            [name]: Math.max((prev[name] || 0) - 1, 0),
        }));
    };

    const allItems = useMemo(() => Object.entries(menu)
        .flatMap(([category, items]) =>
            items.map(item => ({ ...item, category }))
        ), []);

    const filteredItems = useMemo(() => {
        return allItems.filter((item) => {
            const matchesCategory =
                selectedCategory === "All" || item.category === selectedCategory;
            const matchesSearch = item.name
                .toLowerCase()
                .includes(search.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [allItems, search, selectedCategory]);

    const renderOrderItem = ({ item }) => (
        <OrderItem
            key={item.name}
            name={item.name}
            price={item.price}
            quantity={quantities[item.name] || 0}
            image={require("@/assets/images/react-logo.png")}
            onIncrease={() => handleIncrease(item.name)}
            onDecrease={() => handleDecrease(item.name)}
            style={itemStyles.item}
        />
    );

    const fetchData = async () => {
        // Fetch categories from the database
        const dbCategories = await db.getAllAsync("SELECT * FROM categories");
        // Add "All" to the list of categories.
        // Make sure to add it as an object with a name property to be consistent.
        const allCategory = { id: 0, name: "All" };
        setCategories([allCategory, ...dbCategories]);
    }

    useEffect(() => {
        fetchData();
    }, [isFocused]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView keyboardShouldPersistTaps="handled">
                <Text style={styles.header}>Order #123</Text>

                <View>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color="#aaa" />
                        <TextInput
                            style={styles.input}
                            placeholder="Search menu..."
                            placeholderTextColor="#aaa"
                            value={search}
                            onChangeText={setSearch}
                        />
                        <TouchableOpacity onPress={toggleCategories}>
                            <Ionicons
                                name="filter"
                                size={24}
                                color={showCategories ? "#38e07a" : "#aaa"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Animated Category Filter */}
                <Animated.View
                    style={[
                        {
                            opacity,
                            transform: [{ translateY }],
                            display: showCategories ? 'flex' : 'none'
                        }
                    ]}
                >
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryBar}
                    >
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat.name} // Use a unique string from the object
                                style={[
                                    styles.categoryButton,
                                    selectedCategory === cat.name && styles.categoryButtonActive,
                                ]}
                                onPress={() => setSelectedCategory(cat.name)}
                            >
                                <Text
                                    style={[
                                        styles.categoryText,
                                        selectedCategory === cat.name && styles.categoryTextActive,
                                    ]}
                                >
                                    {cat.name} {/* This is the key change */}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Animated.View>

                {/* 📋 Menu Items */}
                <FlatList
                    data={filteredItems}
                    renderItem={renderOrderItem}
                    keyExtractor={(item) => item.name}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.row}
                />
            </ScrollView>

            {/* 🛒 Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, styles.viewOrder]}
                    onPress={() => {
                        const items = Object.entries(quantities)
                            .filter(([_, qty]) => qty > 0)
                            .map(([name, qty]) => {
                                const item = allItems.find((i) => i.name === name);
                                return { ...item, quantity: qty };
                            });

                        router.push({
                            pathname: "/view-order",
                            params: { orderItems: JSON.stringify(items) },
                        });
                    }}
                >
                    <Text style={styles.buttonText}>View Order</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.checkout]}>
                    <Text style={[styles.buttonText, { color: "#122117" }]}>
                        Checkout
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#122117" },
    header: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "700",
        color: "#fff",
        marginVertical: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#264533',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginHorizontal:16,
        marginBottom: 12,
        paddingVertical: 8,
    },
    input: {
        flex: 1,
        marginLeft: 8,
        color: '#fff',
        fontSize: 16, // Increase font size for readability
    },
    categoryBar: {
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    categoryButton: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: "#264533",
        marginRight: 8,
    },
    categoryButtonActive: {
        backgroundColor: "#38e07a",
    },
    categoryText: {
        color: "#fff",
        fontWeight: "500",
    },
    categoryTextActive: {
        color: "#122117",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        bottom: 40,
        backgroundColor: "#122117",
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        marginHorizontal: 6,
        borderRadius: 24,
        alignItems: "center",
    },
    viewOrder: { backgroundColor: "#264533" },
    checkout: { backgroundColor: "#38e07a" },
    buttonText: { fontWeight: "700", fontSize: 16, color: "#fff" },
    listContent: { paddingHorizontal: 10, paddingBottom: 100 },
    row: { justifyContent: "space-between", gap: 10 },
});

const itemStyles = StyleSheet.create({
    item: {
        width: "48%",
        marginBottom: 10,
    },
});

export default Orders;
