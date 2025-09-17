import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function InsulinCalculatorScreen({ route }) {
    const { carbs } = route.params || { carbs: 0 };
    const insulinDose = Math.round(carbs / 10); // 10g carbs = 1 unit insulin (demo ratio)

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Insulin Calculator</Text>
            <Text style={styles.info}>Carbs: {carbs}g</Text>
            <Text style={styles.info}>Estimated Insulin: {insulinDose} units</Text>
            <Text style={styles.note}>Note: Demo ratio (10g/unit). Consult a doctor.</Text>
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
        marginBottom: 20
    },
    info: {
        fontSize: 18,
        marginBottom: 10
    },
    note: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 20
    }
});