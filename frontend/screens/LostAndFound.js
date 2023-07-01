import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firestore } from '../firebase';
import BottomBar from '../BottomBar';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LostAndFound = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = firestore.collection('items').onSnapshot(snapshot => {
      const itemsData = snapshot.docs.map(doc => doc.data());
      setItems(itemsData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddListing = () => {
    navigation.navigate('ListingPage');
  };

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

  const filteredItems = items.filter(item =>
    (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>Lost and Found</Text>
        <TouchableOpacity style={styles.createChatButtonContainer} onPress={handleAddListing}>
          <Ionicons name="add-circle-outline" size={24} style={styles.createChatButtonIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>
      <View style={styles.listContainer}>
        <FlatList data={filteredItems} renderItem={renderItem} keyExtractor={item => item.id ? item.id.toString() : Math.random().toString()} />
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
    marginBottom: 4,
    paddingLeft: 10,
    padding: 16,
    borderBottomColor: '#ccc',
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  createChatButtonContainer: {
    marginLeft: 'auto',
  },
  createChatButtonIcon: {
    color: '#333',
    paddingRight: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    paddingLeft: 6,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
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

export default LostAndFound;
