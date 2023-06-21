import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore, storage } from '../firebase';
import BottomBar from '../BottomBar';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LostAndFound = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const snapshot = await firestore.collection('items').get();
      const itemsData = snapshot.docs.map(doc => doc.data());
      setItems(itemsData);
    } catch (error) {
      console.log('Error fetching items:', error);
    }
  };

  const handleAddListing = () => {
    navigation.navigate('ListingPage');
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemInfoContainer}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>Price: ${item.price}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>Lost and Found</Text>
        <TouchableOpacity style={styles.createChatButtonContainer} onPress={handleAddListing}>
          <Ionicons name="add-circle-outline" size={24} style={styles.createChatButtonIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        <FlatList data={items} renderItem={renderItem} keyExtractor={item => item.id} />
      </View>
      <BottomBar navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingLeft: 10,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  createChatButtonContainer: {
    marginLeft: 'auto',
  },
  createChatButtonIcon: {
    color: '#333',
    paddingRight: 8,
  },
  listContainer: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
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
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 16,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LostAndFound;
