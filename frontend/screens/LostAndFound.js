import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firestore, auth } from '../firebase';
import BottomBar from '../BottomBar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const LostAndFound = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMyListings, setShowMyListings] = useState(false); // State to toggle between All Listings and My Listings
  const [username, setUsername] = useState('');

  useEffect(() => {
    const unsubscribe = firestore.collection('items').onSnapshot(snapshot => {
      const itemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

  const deleteListing = (itemId) => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to delete this listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            firestore.collection('items').doc(itemId).delete()
              .then(() => {
                console.log('Listing deleted successfully!');
              })
              .catch(error => {
                console.log('Error deleting listing:', error);
              });
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfoContainer}>
        <Text style={styles.itemName}>{item.itemName}</Text>
        <Text style={styles.itemDescription}>Description: {item.description}</Text>
        <Text style={styles.itemLocation}>Location: {item.location}</Text>
        <Text style={styles.itemteleHandle}>Tele handle: @{item.teleHandle}</Text>
        {item.username === username && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteListing(item.id)}
          >
            <MaterialIcons name="delete" size={20} color="#888" />
          </TouchableOpacity>
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
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
        <TouchableOpacity style={styles.createListing} onPress={handleAddListing}>
          <MaterialIcons name="post-add" size={25} color="#ffffff" />
        </TouchableOpacity>
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
  createListing: {
    backgroundColor: '#009688',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
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
    margin: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 4,
    marginRight: 10,
    marginLeft: 5,
    marginBottom: 10,
  },
  itemInfoContainer: {
    flex: 1,
    marginBottom: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  itemDescription: {
    fontSize: 14,
    color: '#888',
  },
  itemLocation: {
    fontSize: 14,
    color: '#888',
  },
  itemteleHandle: {
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
  deleteButton: {
    position: 'absolute',
    right: 8,
  },
});

export default LostAndFound;
