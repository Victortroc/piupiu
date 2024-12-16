import { Tabs, router } from "expo-router";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/src/context/Auth";
import { TouchableOpacity } from "react-native";

export default function Layout() {
    const { signOut } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut();
            router.replace("/initial/login");
            alert("Sucesso ao deslogar!");
        } catch (error) {
            alert("Erro ao deslogar!");
        }
    };

    return (
        <Tabs>
            <Tabs.Screen name="(home)" options={{
                headerShown: false,
                title: "Feed",
                tabBarIcon: ({focused, color, size}) => {
                    if (focused) {
                        <MaterialCommunityIcons name="egg-fried" color={color} size={size} />
                    }

                    return <MaterialCommunityIcons name="egg-fried" color={color} size={size} />
                },
            }} /> 
            
            <Tabs.Screen name="user" options={{
                headerShown: true,
                title: "User",
                tabBarIcon: ({focused, color, size}) => {
                    if (focused) {
                        return <FontAwesome name="user" color={color} size={size} />
                    }

                    return <FontAwesome name="user" color={color} size={size} />
                },
                headerTitle:"PiuPiu", 
                headerRight: () => (
                        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 10 }}>
                            <FontAwesome name="sign-out" size={24} color="black" />
                        </TouchableOpacity>
                )
            }} />
        </Tabs>
                    
    )
};