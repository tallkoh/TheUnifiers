import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import BottomBar from './BottomBar';
import Home from './Home';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
      <View style={styles.container}>
        <NavigationContainer>
        <Home />
        <BottomBar />
        </NavigationContainer>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
