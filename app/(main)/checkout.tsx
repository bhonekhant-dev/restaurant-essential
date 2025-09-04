import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const SummaryRow = ({ label, subLabel, value, highlight = false }: any) => (
    <View style={styles.row}>
        <View>
            <Text style={styles.label}>{label}</Text>
            {subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}
        </View>
        <Text style={[styles.value, highlight && styles.highlight]}>{value}</Text>
    </View>
);

const PaymentMethod = ({ icon: Icon, label }: any) => (
    <TouchableOpacity style={styles.paymentOption}>
        <Ionicons name={'cash'} size={24} color="#38e07a" />
        <Text style={styles.paymentLabel}>{label}</Text>
    </TouchableOpacity>
);

const ActionButton = ({ label, primary = false }: any) => (
    <TouchableOpacity
        style={[styles.actionButton, primary ? styles.actionPrimary : styles.actionSecondary]}
    >
        <Text style={[styles.actionText, primary && styles.actionTextPrimary]}>{label}</Text>
    </TouchableOpacity>
);

const CheckoutScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <Text style={styles.header}>Checkout</Text>

                {/* Order Summary */}
                <Text style={styles.sectionTitle}>Order Summary</Text>
                <SummaryRow label="Order #1234" subLabel="Table 4" value="$45.50" />
                <SummaryRow label="Discount" subLabel="10% discount" value="-$4.55" />
                <SummaryRow label="Sales Tax" subLabel="Tax" value="$3.64" />
                <SummaryRow label="Total" subLabel="Total amount due" value="$44.59" highlight />

                {/* Payment Methods */}
                <Text style={styles.sectionTitle}>Payment Methods</Text>
                <PaymentMethod icon={{}} label="Cash" />
                <PaymentMethod icon={{}} label="Credit Card" />
                <PaymentMethod icon={{}} label="Mobile Pay" />
            </ScrollView>

            {/* Actions */}
            <View style={styles.footer}>
                <ActionButton label="Print Receipt" />
                <ActionButton label="Complete Payment" primary />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#122117", padding: 16 },
    header: {
        fontSize: 22,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 16,
        textAlign: "center",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#fff",
        marginTop: 20,
        marginBottom: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#264533",
    },
    label: { fontSize: 16, color: "#fff", fontWeight: "500" },
    subLabel: { fontSize: 14, color: "#96c4a8" },
    value: { fontSize: 16, color: "#fff", fontWeight: "600" },
    highlight: { color: "#38e07a", fontSize: 18 },
    paymentOption: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#264533",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    paymentLabel: { marginLeft: 12, fontSize: 16, color: "#fff" },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: "#122117",
    },
    actionButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 24,
        alignItems: "center",
        marginHorizontal: 6,
    },
    actionSecondary: { backgroundColor: "#264533" },
    actionPrimary: { backgroundColor: "#38e07a" },
    actionText: { fontWeight: "700", fontSize: 16, color: "#fff" },
    actionTextPrimary: { color: "#122117" },
});

export default CheckoutScreen;
