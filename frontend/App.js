import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';

// to change this const to our db
const newsData = [
  {
    id: '1',
    title: 'News Title 2',
    description: 'News Description',
    image: 'https://picsum.photos/200',
  },
  {
    id: '2',
    title: 'News Title',
    description: 'News Description',
    image: 'https://picsum.photos/202',
  },
  {
    id: '3',
    title: 'News Title 3',
    description: 'News Description',
    image: 'https://picsum.photos/201',
  },
  {
    id: '4',
    title: 'News Title 4',
    description: 'News Description',
    image: 'https://picsum.photos/200',
  }
];

const App = () => {
  const renderItem = ({ item }) => (
    <View style={styles.newsItem}>
      <Image source={{ uri: item.image }} style={styles.newsImage} />
      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.newsDescription}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.container}>
      <Text style={styles.appName}>UniFied</Text>
      <FlatList
        data={newsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  appName: {
    font: 'SF Compact',
    fontSize: 20,
    fontWeight: 'black',
  },
  newsItem: {
    marginBottom: 16,
  },
  newsImage: {
    width: 353,
    height: 143,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  newsDescription: {
    fontSize: 16,
    marginTop: 4,
  },
});

export default App;