import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';

export default function GlucoseScreen({ navigation }) {
    const [glucose, setGlucose] = useState(100); // Simulated initial value (mg/dL)

    // Simulate glucose reading (70-200 mg/dL)
    const refreshGlucose = () => {
        const newGlucose = Math.floor(Math.random() * (200 - 70 + 1)) + 70;
        setGlucose(newGlucose);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Glucose Reading</Text>
            <Text style={styles.reading}>{glucose} mg/dL</Text>
            <Button title="Refresh Glucose" onPress={refreshGlucose} />
            <Button title="Pick Food" onPress={() => navigation.navigate('FoodPicker')} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 10
    },
    reading: {
        fontSize: 32,
        marginBottom: 20
    }
});