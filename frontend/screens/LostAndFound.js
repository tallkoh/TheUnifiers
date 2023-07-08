import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firestore, auth } from '../firebase';
import BottomBar from '../BottomBar';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LostAndFound = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMyListings, setShowMyListings] = useState(false); // State to toggle between All Listings and My Listings
  const [username, setUsername] = useState('');

  useEffect(() => {
    const unsubscribe = firestore.collection('items').onSnapshot(snapshot => {
      const itemsData = snapshot.docs.map(doc => doc.data());
      setItems(itemsData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = firestore.collection('users').doc(auth.currentUser.uid).onSnapshot(snapshot => {
      const userData = snapshot.data();
      setUsername(userData.username);
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
        <Text style={styles.itemName}>{item.itemName}</Text>
        <Text style={styles.itemDescription}>Description: {item.description}</Text>
        <Text style={styles.itemLocation}>Location: {item.location}</Text>
        {item.username && (
          <Text style={styles.itemUsername}>
            Posted By: <Text style={styles.usernameText}>{item.username}</Text>
          </Text>
        )}
      </View>
    </View>
  );
  

  const filteredItems = items.filter(item =>
    (item.itemName && item.itemName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const myItems = filteredItems.filter(item => item.username === username);

  const displayedItems = showMyListings ? myItems : filteredItems;

  const handleToggleListings = () => {
    setShowMyListings(prevState => !prevState);
  };

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
          placeholder="Search items..."
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, !showMyListings && styles.activeToggleButton]}
          onPress={handleToggleListings}
        >
          <Text style={[styles.toggleButtonText, !showMyListings && styles.activeToggleButtonText]}>
            All Listings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, showMyListings && styles.activeToggleButton]}
          onPress={handleToggleListings}
        >
          <Text style={[styles.toggleButtonText, showMyListings && styles.activeToggleButtonText]}>
            My Listings
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={displayedItems}
          renderItem={renderItem}
          keyExtractor={item => item.id ? item.id.toString() : Math.random().toString()}
        />
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
    padding: 14,
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
    marginBottom: 2,
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
  toggleContainer: {
    marginLeft: 6,
    marginRight: 6,
    flexDirection: 'row',
    marginBottom: 8,
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  activeToggleButton: {
    backgroundColor: '#009688',
  },
  activeToggleButtonText: {
    color: '#fff',
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
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#888',
  
  },
  itemLocation: {
    fontSize: 14,
    color: '#888',
  },
  itemUsername: {
    fontSize: 14,
    color: '#888',
  },
  usernameText: {
    fontWeight: 'normal',
  },
});

export default LostAndFound;
