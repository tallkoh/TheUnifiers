import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, FlatList } from 'react-native';
import { firestore } from '../firebase';

const MyListings = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore
      .collection('items')
      .where('userId', '==', 'YOUR_USER_ID') // Replace with the user ID of the logged-in user
      .onSnapshot(snapshot => {
        const itemsData = snapshot.docs.map(doc => doc.data());
        setItems(itemsData);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemInfoContainer}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemLocation}>Location: {item.location}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList data={items} renderItem={renderItem} keyExtractor={item => item.id} />
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
  listContainer: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 4,
  },
  itemInfoContainer: {
    flex: 1,
    marginLeft: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 16,
    marginBottom: 4,
  },
  itemLocation: {
    fontSize: 14,
    color: '#888',
  },
});

export default MyListings;
