import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        // Here you can add real auth logic
        if (username && password) {
            await AsyncStorage.setItem('userToken', 'dummy-token');
            router.replace('/');
        } else {
            alert('Please enter both username and password');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login Screen</Text>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16,
    },
    title: {
        fontSize: 24, marginBottom: 24,
    },
    input: {
        width: '100%', padding: 12, borderWidth: 1, borderRadius: 8,
        marginBottom: 16, backgroundColor: '#fff',
    },
});