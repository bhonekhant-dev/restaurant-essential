import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";

const Setting = () => {
    const router = useRouter();
    const handlePress = (section: string) => {
        console.log(`${section} pressed`);
        // Navigate to the respective screen or open modal
    };

    return (
        <SafeAreaView style={styles.container}>
            {/*<Header title="Settings" />*/}

            <View style={{alignItems: "center", marginVertical: 20,borderRadius:8, padding:16, backgroundColor:"#264533"}}>
                <Text style={{fontSize:22,color:'#fff',marginBottom:8,fontWeight:'bold'}}>Mg Zaw Lwin</Text>
                <Text style={{fontSize:16,color:'#ccc'}}>Owner</Text>
            </View>

            {/* Restaurant Info */}
            <TouchableOpacity style={styles.section} onPress={() => handlePress("Restaurant Info")}>
                <Text style={styles.sectionText}>Restaurant Info</Text>
                <Ionicons name={'chevron-forward'} size={20} color="#ccc" />
            </TouchableOpacity>

            {/* Menu Management */}
            <TouchableOpacity style={styles.section} onPress={() => router.push("/manage-items")}>
                <Text style={styles.sectionText}>Manage Categories & Items</Text>
                <Ionicons name={'chevron-forward'} size={20} color="#ccc" />
            </TouchableOpacity>

            {/* User Management */}
            <TouchableOpacity style={styles.section} onPress={() => handlePress("User Management")}>
                <Text style={styles.sectionText}>Manage Waiters</Text>
                <Ionicons name={'chevron-forward'} size={20} color="#ccc" />
            </TouchableOpacity>

            {/* Reports */}
            <TouchableOpacity style={styles.section} onPress={() => handlePress("Reports")}>
                <Text style={styles.sectionText}>Reports & Analytics</Text>
                <Ionicons name={'chevron-forward'} size={20} color="#ccc" />
            </TouchableOpacity>

            {/* About */}
            <TouchableOpacity style={styles.section} onPress={() => handlePress("About")}>
                <Text style={styles.sectionText}>About / App Info</Text>
                <Ionicons name={'chevron-forward'} size={20} color="#ccc" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginVertical: 20,
    },
    section: {
        padding: 16,
        backgroundColor: "#264533",
        borderRadius: 12,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    sectionText: {
        fontSize: 18,
        color: "#fff",
    },
});

export default Setting;
