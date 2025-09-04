import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from "react-native";

interface OrderItemProps {
    name: string;
    price: number;
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    image?: ImageSourcePropType;
    style?: object;
}

const OrderItem: React.FC<OrderItemProps> = ({
                                                 name,
                                                 price,
                                                 quantity,
                                                 onIncrease,
                                                 onDecrease,
                                                 image,
                                                 style,
                                             }) => {
    return (
        <View style={[styles.card, style]}>
            {image && <Image source={image} style={styles.image} />}
            <Text style={styles.name} numberOfLines={1}>
                {name}
            </Text>
            <Text style={styles.price}>${price.toFixed(2)}</Text>
            <View style={styles.controls}>
                <TouchableOpacity style={styles.button} onPress={onDecrease}>
                    <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{quantity}</Text>
                <TouchableOpacity style={styles.button} onPress={onIncrease}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: "#1b2a22",
        borderRadius: 12,
        padding: 12,
        margin: 6,
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: 100,
        borderRadius: 8,
        marginBottom: 8,
        resizeMode: "cover",
    },
    name: {
        fontSize: 14,
        fontWeight: "600",
        color: "#fff",
        textAlign: "center",
        marginBottom: 4,
    },
    price: {
        fontSize: 13,
        color: "#96c4a8",
        marginBottom: 8,
    },
    controls: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: "auto",
    },
    button: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#264533",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 6,
    },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
    quantity: {
        color: "#fff",
        fontSize: 15,
        minWidth: 24,
        textAlign: "center",
    },
});

export default OrderItem;
