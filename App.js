import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen.js'; // Updated path
import DashboardScreen from './screens/DashboardScreen.js'; // Updated path

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Dashboard" component={DashboardScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}