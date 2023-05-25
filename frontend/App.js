import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import newsData from './newsData';
import ChatPage from './ChatPage';
import logo from './assets/logo_transparent_notext.jpeg';
import logoText from './assets/logo_transparent_onlytext.jpeg';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const App = () => {
  const renderItem = ({ item }) => (
    <View style={styles.newsItem}>
      <Image source={{ uri: item.image }} style={styles.newsImage} />
      <View style={styles.newsInfoContainer}>
        <Text style={styles.newsTitle}>{item.title}</Text>
        <Text style={styles.newsDescription}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} renderItem={renderItem} />}
        </Stack.Screen>
        <Stack.Screen name="Chat" component={ChatPage} options={{ title: 'Module Chats' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = ({ navigation, renderItem }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appLogoContainer}>
        <Image source={logo} style={styles.logo} />
        <Image source={logoText} style={styles.logoText} />
      </View>
      <View style={styles.container}>
        <FlatList
          data={newsData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBarButton}>
          <Icon name="md-newspaper-outline" size={24} style={styles.icon} />
          <Text style={styles.bottomBarButtonText}>News</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarButton} onPress={() => navigation.navigate('Chat')}>
          <Icon name="chatbox-ellipses-outline" size={24} style={styles.icon} />
          <Text style={styles.bottomBarButtonText}>Module Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarButton}>
          <Icon name="locate" size={24} style={styles.icon} />
          <Text style={styles.bottomBarButtonText}>Lost & Found</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 25,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  logoText: {
    width: 100,
    height: 50,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    marginTop: -5,
  },
  newsItem: {
    marginBottom: 16,
    alignItems: 'center',
  },
  newsImage: {
    width: '100%',
    height: 143,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  newsInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  newsDescription: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Space the buttons evenly
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 8,
  },
  bottomBarButton: {
    flex: 1, // Equal flex distribution for all buttons
    paddingVertical: 8,
    alignItems: 'center',
  },
  bottomBarButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  icon: {
    marginBottom: 4,
  },
});

export default App;

