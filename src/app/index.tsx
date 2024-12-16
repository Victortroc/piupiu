import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../context/Auth";


const Index: React.FC = () => {
    const { signed } = useAuth();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            if (signed) {
                router.replace("/(tabs)/feed/(home)");
            } else {
                router.replace("/initial/login");
            }
        }
    }, [signed, isMounted]);

    if (!isMounted) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return null;
};

export default Index;
