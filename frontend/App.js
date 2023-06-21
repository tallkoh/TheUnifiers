import 'react-native-gesture-handler';
import React from 'react';
import ChatPage from './screens/ChatPage';
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';
import RegisterPage from './screens/RegisterPage';
import LostAndFound from './screens/LostAndFound';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ListingPage from './screens/ListingPage';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginPage} options={{ title: 'Login' }} />
        <Stack.Screen name="Register" component={RegisterPage} options={{ title: 'Register' }} />
        <Stack.Screen name="Home" component={HomePage} options={{ title: 'Home' }} />
        <Stack.Screen name="Chat" component={ChatPage} options={{ title: 'Module Chats' }} />
        <Stack.Screen name="LostAndFound" component={LostAndFound} options={{ title: 'Lost And Found' }} />
        <Stack.Screen name="ListingPage" component={ListingPage} options={{ title: 'Listing Page' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;

