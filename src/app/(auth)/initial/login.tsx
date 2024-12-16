import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import { useAuth } from "../../../context/Auth";
import { router } from "expo-router";

const Home: React.FC = () => {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin() {
        try {
            await signIn(email, password);
            alert('Logado!');
            router.replace("/feed");
        } catch (error) {
            alert('Erro ao logar!');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(value) => setEmail(value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                onChangeText={(value) => setPassword(value)}
            />
            <Button title="Feed" onPress={handleLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18, marginBottom: 20 },
  input: { borderBottomWidth: 1, marginBottom: 20, padding: 10 },
});

export default Home;
