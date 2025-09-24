import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Correct import

export default function GlucoseScreen({ navigation }) {
    const [selectedUser, setSelectedUser] = useState('good'); // Default to good control
    const [glucose, setGlucose] = useState(5.0); // Initial as number

    // Initialize glucose on user change
    useEffect(() => {
        console.log('User changed to:', selectedUser); // Debug user state
        if (['good', 'alright', 'bad'].includes(selectedUser)) {
            refreshGlucose();
        } else {
            console.warn('Invalid user selected:', selectedUser, 'defaulting to good');
            setSelectedUser('good'); // Reset to valid default
            refreshGlucose();
        }
    }, [selectedUser]);

    const refreshGlucose = () => {
        console.log('Refreshing glucose for:', selectedUser); // Debug before calculation
        let newGlucose;
        switch (selectedUser) {
            case 'good':
                newGlucose = Math.random() * (7.0 - 4.0) + 4.0; // 4.0-7.0 mmol/L
                break;
            case 'alright':
                newGlucose = Math.random() * (9.0 - 7.1) + 7.1; // 7.1-9.0 mmol/L
                break;
            case 'bad':
                newGlucose = Math.random() * (15.0 - 9.1) + 9.1; // 9.1-15.0 mmol/L
                break;
            default:
                console.log('Invalid user state, defaulting to 5.0'); // Debug default case
                newGlucose = 5.0;
        }
        setGlucose(parseFloat(newGlucose.toFixed(1))); // Ensure number
        console.log('New glucose value:', newGlucose); // Debug after calculation
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>GlucoGuide - Glucose Monitor</Text>
            <Text style={styles.label}>Select User Control Level:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedUser}
                    style={styles.picker}
                    onValueChange={(itemValue) => {
                        console.log('Picker selected:', itemValue); // Debug picker value
                        if (itemValue) setSelectedUser(itemValue);
                    }}
                >
                    <Picker.Item label="Good Control" value="good" />
                    <Picker.Item label="Alright Control" value="alright" />
                    <Picker.Item label="Bad Control" value="bad" />
                </Picker>
            </View>
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
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 10,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
    },
    picker: {
        height: 50,
        width: 200,
    },
    reading: {
        fontSize: 32,
        marginBottom: 20,
    },
});