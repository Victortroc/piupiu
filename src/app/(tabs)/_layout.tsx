import { Stack, router } from "expo-router";
import { useAuth } from "../../context/Auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";


export default function Layout() {
    const { signed } = useAuth();
    const [isMounted, setIsMounted] = useState(false); 

    useEffect(() => {
        setIsMounted(true); 

        if (!signed && isMounted) {
            router.replace("/initial/login");
        }
    }, [signed, isMounted]);

    if (!isMounted) {
        return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    }

    return (
        <Stack>
            <Stack.Screen name="feed" options={{
                    headerShown: false,
                }} />
        </Stack> 
    )
};

