import React from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import OrderItem from "@/components/OrderItem";
import Header from "@/components/header";

const TAX_RATE = 0.05; // 5% tax

const ViewOrder = () => {
    const router = useRouter();
    const { orderItems: orderItemsString } = useLocalSearchParams();

    // Parse order items passed as JSON string
    const orderItems = orderItemsString
        ? JSON.parse(orderItemsString as string)
        : [];

    const subtotal = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    const renderItem = ({ item }) => (
        <OrderItem
            name={item.name}
            price={item.price}
            quantity={item.quantity}
            image={require("@/assets/images/react-logo.png")}
            onIncrease={() => {}} // optional: implement update via context or state
            onDecrease={() => {}}
            style={styles.orderItem}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Your Order" />

            <FlatList
                data={orderItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
                contentContainerStyle={{ paddingBottom: 120 }}
            />

            {/* Summary */}
            <View style={styles.summary}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>Subtotal</Text>
                    <Text style={styles.summaryText}>${subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>Tax(5%)</Text>
                    <Text style={styles.summaryText}>${tax.toFixed(2)}</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalText}>Total</Text>
                    <Text style={styles.totalText}>${total.toFixed(2)}</Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, styles.back]}
                    onPress={() => router.back()}
                >
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.checkout]}
                    // onPress={() => router.push("/checkout")}
                >
                    <Text style={[styles.buttonText, { color: "#122117" }]}>Checkout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#122117" },
    orderItem: {
        marginHorizontal: 12,
        marginBottom: 12,
    },
    summary: {
        backgroundColor: "#264533",
        padding: 16,
        marginHorizontal: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    summaryText: { color: "#fff", fontSize: 16 },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: "#3a5d46",
        marginTop: 8,
        paddingTop: 8,
    },
    totalText: { color: "#38e07a", fontSize: 18, fontWeight: "700" },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: "#122117",
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        marginHorizontal: 6,
        borderRadius: 24,
        alignItems: "center",
    },
    back: { backgroundColor: "#264533" },
    checkout: { backgroundColor: "#38e07a" },
    buttonText: { fontWeight: "700", fontSize: 16, color: "#fff" },
});

export default ViewOrder;
