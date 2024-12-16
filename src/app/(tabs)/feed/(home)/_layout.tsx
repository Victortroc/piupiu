import { Stack, router } from "expo-router";
import { useAuth } from "@/src/context/Auth";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity, ActivityIndicator, View } from "react-native";
import { useEffect, useState } from "react";

export default function Layout() {
    const { signed, signOut } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut();
            router.replace("/initial/login");
            alert("Sucesso ao deslogar!");
        } catch (error) {
            alert("Erro ao deslogar!");
        }
    };

    return(
        <Stack>
            <Stack.Screen name="index" options={{headerTitle:"PiuPiu", 
                headerRight: () => (
                    <TouchableOpacity onPress={handleLogout} style={{ marginRight: 10 }}>
                        <FontAwesome name="sign-out" size={24} color="black" />
                    </TouchableOpacity>
                ), animation: "fade"
                }}/>
            <Stack.Screen name="messages" options={{headerTitle: "Post", animation: "fade"
            }}/>
        </Stack>
    )
}