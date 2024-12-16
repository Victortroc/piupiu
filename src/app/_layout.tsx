import React from "react";
import { Slot } from "expo-router";
import { AuthProvider } from "../context/Auth";
import FlashMessage from 'react-native-flash-message';
import { SafeAreaView, StyleSheet, View } from "react-native";
import { StatusBar } from 'expo-status-bar'; 

const RootLayout: React.FC = () => {
    return (
        <AuthProvider>
            <SafeAreaView style={styles.container}>
                <StatusBar style="dark" />
                <View style={styles.content}>
                    <Slot />
                    <FlashMessage position="top" />
                </View>
            </SafeAreaView>
        </AuthProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        marginTop: 20,
    },
})

export default RootLayout;