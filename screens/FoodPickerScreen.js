import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';

export default function FoodPickerScreen({ navigation }) {
    const foods = [
        { name: 'Porridge', carbs: 30 },
        { name: 'Haggis', carbs: 20 },
        { name: 'Shortbread', carbs: 15 }
    ];
    const [selectedFood, setSelectedFood] = useState(null);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Pick a Scottish Food</Text>
            {foods.map((food, index) => (
                <Button
                    key={index}
                    title={`${food.name} (${food.carbs}g carbs)`}
                    onPress={() => {
                        setSelectedFood(food);
                        navigation.navigate('InsulinCalculator', { carbs: food.carbs });
                    }}
                />
            ))}
            {selectedFood && (
                <Text style={styles.selection}>Selected: {selectedFood.name}</Text>
            )}
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
    selection: {
        fontSize: 18,
        marginTop: 20
    }
});