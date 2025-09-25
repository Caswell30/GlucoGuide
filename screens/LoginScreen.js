import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { initializeDatabase, importUsersFromCSV, getUserByUsername } from '../utils/userDatabase';

const assetPath = FileSystem.documentDirectory + 'users.csv';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        initializeDatabase().then(() => {
            return FileSystem.getInfoAsync(FileSystem.bundleDirectory + 'assets/users.csv')
                .then(info => {
                    if (info.exists) {
                        return FileSystem.copyAsync({
                            from: FileSystem.bundleDirectory + 'assets/users.csv',
                            to: assetPath,
                        }).catch(error => console.warn('CSV copy failed:', error));
                    }
                })
                .then(() => importUsersFromCSV(assetPath))
                .finally(() => setLoading(false));
        }).catch(error => {
            console.error('Initialization error:', error);
            setLoading(false);
        });
    }, []);

    const handleLogin = () => {
        if (!username) {
            Alert.alert('Error', 'Please enter a username');
            return;
        }
        setLoading(true);
        getUserByUsername(username, (user) => {
            setLoading(false);
            if (user) {
                Alert.alert('Success', `Welcome, ${user.username}!`);
                navigation.navigate('Dashboard', { user });
            } else {
                Alert.alert('Error', 'Invalid username');
            }
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>GlucoGuide - Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
            <Button title="Login" onPress={handleLogin} disabled={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
    input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 },
    loader: { marginVertical: 10 },
});