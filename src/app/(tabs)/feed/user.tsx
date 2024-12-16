import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/src/context/Auth";

export default function User() {
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            <Text>Página { user?.username }</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});