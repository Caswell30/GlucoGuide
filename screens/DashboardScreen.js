import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';

export default function DashboardScreen({ route, navigation }) {
    const { user } = route.params;
    const [glucose, setGlucose] = useState(5.0);

    const refreshGlucose = () => {
        const newGlucose = Math.random() * (user.maxGlucose - user.minGlucose) + user.minGlucose;
        setGlucose(parseFloat(newGlucose.toFixed(1)));
    };

    useEffect(() => {
        refreshGlucose();
    }, [user]);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>GlucoGuide - Dashboard</Text>
            <Text style={styles.label}>Welcome, {user.username} ({user.controlLevel})</Text>
            <Text style={styles.reading}>Current Glucose: {glucose} mmol/L</Text>
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
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    reading: {
        fontSize: 32,
        marginBottom: 20,
    },
});