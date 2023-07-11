import 'react-native-gesture-handler';
import React, { useState } from 'react';
import ChatPage from './screens/ChatPage';
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';
import RegisterPage from './screens/RegisterPage';
import LostAndFound from './screens/LostAndFound';
import ListingPage from './screens/ListingPage';
import { ChatProvider } from './ChatContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();

const App = () => {
  const [selectedModules, setSelectedModules] = useState([]);
  const [showAllModules, setShowAllModules] = useState(true);

  return (
    <ChatProvider value={{ selectedModules, setSelectedModules, showAllModules, setShowAllModules }}>
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
    </ChatProvider>
  );
};


export default App;

