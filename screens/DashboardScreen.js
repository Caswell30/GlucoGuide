import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert, FlatList } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { updateUser, getHistoricalData, calculateAverages } from '../utils/userDatabase';

const screenWidth = Dimensions.get('window').width - 40;

export default function DashboardScreen({ route, navigation }) {
    const { user } = route.params;
    // Initialize editableUser with defaults to avoid undefined properties
    const [editableUser, setEditableUser] = useState({
        ...user,
        minGlucose: user.minGlucose || 0,
        maxGlucose: user.maxGlucose || 0,
        carbRatio: user.carbRatio || 0,
        correctionFactor: user.correctionFactor || 0,
    });
    const [editing, setEditing] = useState(false);
    const [averages, setAverages] = useState({ daily: {}, weekly: {}, monthly: {} });

    useEffect(() => {
        console.log('Fetching historical data for:', user.username);
        getHistoricalData(user.username, (data) => {
            console.log('Raw historical data:', data);
            const calculatedAverages = calculateAverages(data);
            console.log('Calculated averages:', calculatedAverages);
            setAverages(calculatedAverages);
        });
    }, [user.username]);

    const handleSave = () => {
        updateUser(user.username, editableUser, (success) => {
            if (success) {
                console.log('User updated successfully');
                setEditing(false);
            } else {
                Alert.alert('Error', 'Failed to update user');
            }
        });
    };

    const renderAverageItem = ({ item }) => (
        <View style={styles.averageItem}>
            <Text style={styles.averageLabel}>{item.period}</Text>
            <Text>Blood Glucose: {item.bloodGlucose || 'N/A'} mmol/L</Text>
            <Text>Carb Intake: {item.carbIntake || 'N/A'} g</Text>
            <Text>Insulin: {item.insulin || 'N/A'} U</Text>
        </View>
    );

    const averageData = [
        ...Object.entries(averages.daily).map(([date, vals]) => ({ period: date, ...vals })),
        ...Object.entries(averages.weekly).map(([week, vals]) => ({ period: `Week ${week.split('-W')[1]}`, ...vals })),
        ...Object.entries(averages.monthly).map(([month, vals]) => ({ period: new Date(month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' }), ...vals })),
    ];

    console.log('Average data for rendering:', averageData);

    const chartData = {
        labels: Object.keys(averages.monthly).map(month => new Date(month + '-01').toLocaleString('default', { month: 'short' })),
        datasets: [
            {
                data: Object.values(averages.monthly).map(m => parseFloat(m.bloodGlucose) || 0),
                color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Red
                strokeWidth: 2,
            },
            {
                data: Object.values(averages.monthly).map(m => parseFloat(m.carbIntake) || 0),
                color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`, // Blue
                strokeWidth: 2,
            },
            {
                data: Object.values(averages.monthly).map(m => parseFloat(m.insulin) || 0),
                color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`, // Teal
                strokeWidth: 2,
            },
        ],
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome, {editableUser.username || 'User'}!</Text>
            {editing ? (
                <>
                    <TextInput
                        style={styles.input}
                        value={editableUser.controlLevel || ''}
                        onChangeText={(text) => setEditableUser({ ...editableUser, controlLevel: text })}
                    />
                    <TextInput
                        style={styles.input}
                        value={editableUser.minGlucose.toString()}
                        onChangeText={(text) => setEditableUser({ ...editableUser, minGlucose: parseFloat(text) || 0 })}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        value={editableUser.maxGlucose.toString()}
                        onChangeText={(text) => setEditableUser({ ...editableUser, maxGlucose: parseFloat(text) || 0 })}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        value={editableUser.carbRatio.toString()}
                        onChangeText={(text) => setEditableUser({ ...editableUser, carbRatio: parseFloat(text) || 0 })}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        value={editableUser.correctionFactor.toString()}
                        onChangeText={(text) => setEditableUser({ ...editableUser, correctionFactor: parseFloat(text) || 0 })}
                        keyboardType="numeric"
                    />
                    <Button title="Save" onPress={handleSave} />
                </>
            ) : (
                <>
                    <Text>Control Level: {editableUser.controlLevel || 'N/A'}</Text>
                    <Text>Min Glucose: {editableUser.minGlucose || 0}</Text>
                    <Text>Max Glucose: {editableUser.maxGlucose || 0}</Text>
                    <Text>Carb Ratio: {editableUser.carbRatio || 0}</Text>
                    <Text>Correction Factor: {editableUser.correctionFactor || 0}</Text>
                    <Button title="Edit Profile" onPress={() => setEditing(true)} />
                </>
            )}
            <Text style={styles.sectionTitle}>Averages</Text>
            {averageData.length > 0 ? (
                <FlatList
                    data={averageData}
                    renderItem={renderAverageItem}
                    keyExtractor={(item) => item.period}
                    style={styles.averageList}
                />
            ) : (
                <Text>No average data available</Text>
            )}
            <Text style={styles.sectionTitle}>Monthly Trends</Text>
            {Object.keys(averages.monthly).length > 0 && (
                <LineChart
                    data={chartData}
                    width={screenWidth}
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix=""
                    yAxisInterval={1}
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 1,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: { borderRadius: 16 },
                        propsForDots: { r: '6', strokeWidth: '2', stroke: '#ffa726' },
                    }}
                    bezier
                    style={styles.chart}
                />
            )}
            <Button title="Logout" onPress={() => Alert.alert('Logout', 'Are you sure?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: () => navigation.navigate('Login') },
            ])} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20 },
    input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10, width: 200 },
    sectionTitle: { fontSize: 20, marginVertical: 10 },
    averageList: { width: '100%', marginBottom: 20 },
    averageItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', width: '100%' },
    averageLabel: { fontWeight: 'bold', marginBottom: 5 },
    chart: { marginVertical: 8, borderRadius: 16 },
});