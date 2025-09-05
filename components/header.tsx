import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <View style={styles.container}>
            {/* Left - Back button */}
            <View style={styles.side}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Center - Title */}
            <View style={styles.center}>
                <Text style={styles.title}>{title}</Text>
            </View>

            {/* Right - Empty to balance layout */}
            <View style={styles.side} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#122117",
        borderBottomWidth: 1,
        borderBottomColor: "#264533",
        marginBottom: 12,
    },
    side: {
        width: 40, // same width as back button area for symmetry
        alignItems: "flex-start",
    },
    center: {
        flex: 1,
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#fff",
    },
});

export default Header;
