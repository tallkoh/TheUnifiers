import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { firestore, auth, storage } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const ListingPage = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState('');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [teleHandle, setTeleHandle] = useState('');
  const [progress, setProgress] = useState(0);

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspectRatio: [3, 4],
      quality: 1
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await uploadImage(result.assets[0].uri, "image")
      // setImageUri(result.uri);
    }
  }

  async function uploadImage(uri, fileType) {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `images/` + new Date().getTime());
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setProgress(progress.toFixed());
        console.log("DOne")
      },
      (error) => {
        console.log(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log('File available at', downloadURL);
          setImage(downloadURL);
        })
      }
    )
  }


  const handleAddItem = async () => {
    const user = await firestore.collection('users').doc(auth.currentUser.uid).get();
    const userData = user.data();
    const username = userData.username;
    
    try {
      const newItem = {
        image: image,
        itemName: itemName,
        description: description,
        location: location,
        teleHandle: teleHandle,
        username: username,
      };
  
      // Store the new item in Firestore
      await firestore.collection('items').add(newItem);
  
      // Reset the form fields
      setImage('');
      setItemName('');
      setDescription('');
      setLocation('');
  
      // Navigate back to the LostAndFound page
      navigation.goBack();
    } catch (error) {
      console.log('Error adding item:', error); // Log the error for debugging
      // Display an error message to the user
      // You can use a state variable to show the error message in the UI
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={24} />
      </TouchableOpacity>
      <TouchableOpacity onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.chooseImageText}>Choose Image</Text>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={itemName}
        onChangeText={text => setItemName(text)}
        autoCapitalize='none'
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        multiline={true}
        numberOfLines={4}
        value={description}
        onChangeText={text => setDescription(text)}
        autoCapitalize='none'
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={text => setLocation(text)}
        autoCapitalize='none'
      />
      <TextInput
        style={styles.input}
        placeholder="Tele Handle"
        value={teleHandle}
        onChangeText={(text) => {
          const trimmedText = text.trim();
          const regex = /^[a-zA-Z0-9_]*$/;

          if (regex.test(trimmedText)) {
            setTeleHandle(trimmedText);
          }
        }}
        autoCapitalize='none'
      />
      <Button title="Add Item" onPress={handleAddItem} />
    </KeyboardAvoidingView>
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
