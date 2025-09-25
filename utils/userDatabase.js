import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

export const initializeDatabase = async () => {
    try {
        const users = await AsyncStorage.getItem('users');
        if (!users) {
            const defaultUsers = JSON.stringify([
                { username: 'good', controlLevel: 'Standard', minGlucose: 70, maxGlucose: 180, carbRatio: 10, correctionFactor: 50 },
                { username: 'bad', controlLevel: 'Advanced', minGlucose: 60, maxGlucose: 200, carbRatio: 12, correctionFactor: 60 },
                { username: 'average', controlLevel: 'Standard', minGlucose: 65, maxGlucose: 190, carbRatio: 11, correctionFactor: 55 }
            ]);
            await AsyncStorage.setItem('users', defaultUsers);
            console.log('Default users initialized in AsyncStorage');
            await generateHistoricalData();
        } else {
            // Ensure historical data exists for existing users
            await generateHistoricalData();
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
        const users = rows.map(row => {
            const [username, controlLevel, minGlucose, maxGlucose, carbRatio, correctionFactor] = row.split(',').map(item => item.trim());
            return username && controlLevel && minGlucose && maxGlucose && carbRatio && correctionFactor
                ? { username, controlLevel, minGlucose: parseFloat(minGlucose), maxGlucose: parseFloat(maxGlucose), carbRatio: parseFloat(carbRatio), correctionFactor: parseFloat(correctionFactor) }
                : null;
        }).filter(user => user !== null);
        if (users.length > 0) {
            await AsyncStorage.setItem('users', JSON.stringify(users));
            console.log('Users imported from CSV into AsyncStorage');
            await generateHistoricalData();
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

export const updateUser = async (username, updatedUser, callback) => {
    try {
        const users = await AsyncStorage.getItem('users');
        const userList = users ? JSON.parse(users) : [];
        const updatedList = userList.map(u => u.username === username ? updatedUser : u);
        await AsyncStorage.setItem('users', JSON.stringify(updatedList));
        callback(true);
    } catch (error) {
        console.error('Error updating user:', error);
        callback(false);
    }
};

// New function to generate historical data
const generateHistoricalData = async () => {
    try {
        const users = await AsyncStorage.getItem('users');
        const userList = users ? JSON.parse(users) : [];
        const startDate = new Date(2025, 5, 25); // June 25, 2025
        const endDate = new Date(2025, 8, 23); // September 23, 2025 (3 months)

        for (const user of userList) {
            const existingData = await AsyncStorage.getItem(`historicalData_${user.username}`);
            if (!existingData) {
                const data = [];
                let currentDate = new Date(startDate);
                while (currentDate <= endDate) {
                    const entriesPerDay = Math.floor(Math.random() * 3) + 4; // 4-6 entries per day
                    for (let i = 0; i < entriesPerDay; i++) {
                        const time = `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
                        data.push({
                            date: currentDate.toISOString().split('T')[0],
                            time,
                            bloodGlucose: (Math.random() * 27.5 + 2.5).toFixed(1), // 2.5-30.0
                            carbIntake: Math.floor(Math.random() * 241), // 0-240g
                            insulin: Math.floor(Math.random() * 50) / 10, // 0.0-5.0 units
                        });
                    }
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                await AsyncStorage.setItem(`historicalData_${user.username}`, JSON.stringify(data));
                console.log(`Generated historical data for ${user.username}`);
            } else {
                console.log(`Historical data already exists for ${user.username}`);
            }
        }
    } catch (error) {
        console.error('Error generating historical data:', error);
    }
};

// New function to get historical data
export const getHistoricalData = async (username, callback) => {
    try {
        const data = await AsyncStorage.getItem(`historicalData_${username}`);
        callback(data ? JSON.parse(data) : []);
    } catch (error) {
        console.error('Error getting historical data:', error);
        callback([]);
    }
};

// New function to calculate averages
export const calculateAverages = (data) => {
    if (!data.length) {
        console.log('No data to calculate averages');
        return { daily: {}, weekly: {}, monthly: {} };
    }

    const daily = {};
    const weekly = {};
    const monthly = {};

    data.forEach(entry => {
        const date = new Date(entry.date);
        const dayKey = entry.date;
        const weekKey = `${date.getFullYear()}-W${Math.floor((date.getDate() - 1) / 7) + 1}`; // Adjusted week calculation
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!daily[dayKey]) daily[dayKey] = { count: 0, bloodGlucose: 0, carbIntake: 0, insulin: 0 };
        if (!weekly[weekKey]) weekly[weekKey] = { count: 0, bloodGlucose: 0, carbIntake: 0, insulin: 0 };
        if (!monthly[monthKey]) monthly[monthKey] = { count: 0, bloodGlucose: 0, carbIntake: 0, insulin: 0 };

        daily[dayKey].count += 1;
        daily[dayKey].bloodGlucose += parseFloat(entry.bloodGlucose);
        daily[dayKey].carbIntake += parseFloat(entry.carbIntake);
        daily[dayKey].insulin += parseFloat(entry.insulin);

        weekly[weekKey].count += 1;
        weekly[weekKey].bloodGlucose += parseFloat(entry.bloodGlucose);
        weekly[weekKey].carbIntake += parseFloat(entry.carbIntake);
        weekly[weekKey].insulin += parseFloat(entry.insulin);

        monthly[monthKey].count += 1;
        monthly[monthKey].bloodGlucose += parseFloat(entry.bloodGlucose);
        monthly[monthKey].carbIntake += parseFloat(entry.carbIntake);
        monthly[monthKey].insulin += parseFloat(entry.insulin);
    });

    return {
        daily: Object.fromEntries(Object.entries(daily).map(([key, val]) => [
            key,
            {
                bloodGlucose: val.count > 0 ? (val.bloodGlucose / val.count).toFixed(1) : 'N/A',
                carbIntake: val.count > 0 ? (val.carbIntake / val.count).toFixed(1) : 'N/A',
                insulin: val.count > 0 ? (val.insulin / val.count).toFixed(1) : 'N/A',
            }
        ])),
        weekly: Object.fromEntries(Object.entries(weekly).map(([key, val]) => [
            key,
            {
                bloodGlucose: val.count > 0 ? (val.bloodGlucose / val.count).toFixed(1) : 'N/A',
                carbIntake: val.count > 0 ? (val.carbIntake / val.count).toFixed(1) : 'N/A',
                insulin: val.count > 0 ? (val.insulin / val.count).toFixed(1) : 'N/A',
            }
        ])),
        monthly: Object.fromEntries(Object.entries(monthly).map(([key, val]) => [
            key,
            {
                bloodGlucose: val.count > 0 ? (val.bloodGlucose / val.count).toFixed(1) : 'N/A',
                carbIntake: val.count > 0 ? (val.carbIntake / val.count).toFixed(1) : 'N/A',
                insulin: val.count > 0 ? (val.insulin / val.count).toFixed(1) : 'N/A',
            }
        ])),
    };
};