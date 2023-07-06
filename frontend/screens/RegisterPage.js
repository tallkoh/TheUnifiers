import React, { useState } from 'react';
import { SafeAreaView, View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from '../firebase';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Registered with:', user.email);
        saveUserData(user.uid);
        navigation.navigate('Login');
      })
      .catch(error => alert(error.message));
  };

  const saveUserData = userId => {
    firestore
      .collection('users')
      .doc(userId)
      .set({
        username: username,
        email: email,
      })
      .then(() => {
        console.log('User data saved successfully!');
      })
      .catch(error => {
        console.log('Error saving user data:', error);
      });
  };

  const handleGoBack = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
          <Icon name="arrow-back-outline" size={24} style={styles.goBackButtonIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.imageContainer}></View>
        <Image source={require('../assets/logo_transparent.png')} style={styles.image} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={text => setUsername(text)}
          value={username}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={text => setEmail(text)}
          value={email}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={text => setPassword(text)}
          value={password}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          onChangeText={text => setConfirmPassword(text)}
          value={confirmPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.buttonContainer} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 16,
  },
content: {
    flex: 15,
    paddingBottom: 78,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goBackButton: {
    marginRight: 10,
  },
  goBackButtonIcon: {
    color: '#333',
  },
  imageContainer: {
    marginTop: -120,
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'center',
  },
  input: {
    width: '80%',
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 5,
  },
  buttonContainer: {
    width: '40%',
    marginTop: 15,
    padding: 15,
    backgroundColor: '#59cbbd',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
