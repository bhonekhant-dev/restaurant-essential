import Header from "@/components/header";
import React from "react";
import {StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useRouter} from "expo-router";

export default function ManageCategoriesScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Manage Categories & Items"/>
            <View style={{padding: 12, flex: 1, justifyContent: 'center'}}>
                <TouchableOpacity style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#264533',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 30
                }} onPress={() => {
                    router.push('/(main)/categories');
                }}>
                    <Text style={{fontSize: 18, color: "white"}}>Categories</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#264533',
                    padding: 12,
                    borderRadius: 8,
                }} onPress={() => {
                    router.push('/(main)/items');
                }}>
                    <Text style={{fontSize: 18, color: "white"}}>Items</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1},
});
