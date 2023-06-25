import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { firestore } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ListingPage = () => {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const handleChooseImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (!response.didCancel && !response.errorCode) {
        setImageUri(response.uri);
      }
    });
  };

  const handleAddItem = async () => {
    try {
      const newItem = {
        image: imageUri,
        itemName: itemName,
        description: description,
        location: location,
      };

      // Store the new item in Firestore
      await firestore.collection('items').add(newItem);

      // Reset the form fields
      setImageUri(null);
      setItemName('');
      setDescription('');
      setLocation('');

      // Navigate back to the LostAndFound page
      navigation.goBack();
    } catch (error) {
      console.log('Error adding item:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={24} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleChooseImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.chooseImageText}>Choose Image</Text>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={itemName}
        onChangeText={text => setItemName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        multiline={true}
        numberOfLines={4}
        value={description}
        onChangeText={text => setDescription(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={text => setLocation(text)}
      />
      <Button title="Add Item" onPress={handleAddItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    paddingTop: 30,
    position: 'absolute',
    top: 16,
    left: 16,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  chooseImageText: {
    fontSize: 18,
    color: '#888',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});

export default ListingPage;
