import 'react-native-gesture-handler';
import React from 'react';
import ChatPage from './screens/ChatPage';
import HomePage from './screens/HomePage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomePage} options={{ title: 'Home' }} />
        <Stack.Screen name="Chat" component={ChatPage} options={{ title: 'Module Chats' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;

