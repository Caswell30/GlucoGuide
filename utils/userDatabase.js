import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy'; // Changed to legacy API

export const initializeDatabase = async () => {
    try {
        const users = await AsyncStorage.getItem('users');
        if (!users) {
            const defaultUsers = JSON.stringify([{ username: 'gooduser', controlLevel: 'Standard' }]);
            await AsyncStorage.setItem('users', defaultUsers);
            console.log('Default user initialized in AsyncStorage');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

export const importUsersFromCSV = async (csvPath) => {
    try {
        if (await FileSystem.getInfoAsync(csvPath).then(info => !info.exists)) {
            console.warn('CSV file not found at:', csvPath);
            return;
        }
        const csvContent = await FileSystem.readAsStringAsync(csvPath);
        const rows = csvContent.split('\n').slice(1); // Skip header
        const users = rows
            .map(row => {
                const [username, controlLevel] = row.split(',').map(item => item.trim());
                return username && controlLevel ? { username, controlLevel } : null;
            })
            .filter(user => user !== null);
        if (users.length > 0) {
            await AsyncStorage.setItem('users', JSON.stringify(users));
            console.log('Users imported from CSV into AsyncStorage');
        } else {
            console.warn('No valid users found in CSV');
        }
    } catch (error) {
        console.error('Error importing CSV:', error);
    }
};

export const getUserByUsername = async (username, callback) => {
    try {
        const users = await AsyncStorage.getItem('users');
        const userList = users ? JSON.parse(users) : [];
        const user = userList.find(u => u.username === username) || null;
        callback(user);
    } catch (error) {
        console.error('Error getting user:', error);
        callback(null);
    }
};