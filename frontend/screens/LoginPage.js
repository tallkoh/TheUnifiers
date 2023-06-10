import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from '../firebase';

const LoginScreen = () => {
  const [emailOrUsername, setEmailOrUsername] = useState(''); // Use a single state variable for email or username
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setTimeout(() => {
          navigation.navigate('Home');
        }, 0);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = () => {
    firestore
    .collection('users')
    .where('email', '==', emailOrUsername)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.empty) {
        // If no email matches, check for username
        firestore
          .collection('users')
          .where('username', '==', emailOrUsername)
          .get()
          .then(querySnapshot => {
            if (querySnapshot.empty) {
              console.log('User not found!');
            } else {
              // Log in with the matched username
              const userDoc = querySnapshot.docs[0];
              const userData = userDoc.data();
              auth
                .signInWithEmailAndPassword(userData.email, password)
                .then(() => {
                  console.log('User successfully logged in!');
                })
                .catch(error => {
                  console.log('Login error:', error);
                });
            }
          })
          .catch(error => {
            console.log('Query error:', error);
          });
      } else {
        // Log in with the matched email
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        auth
          .signInWithEmailAndPassword(userData.email, password)
          .then(() => {
            console.log('User successfully logged in!');
          })
          .catch(error => {
            console.log('Login error:', error);
          });
      }
    })
    .catch(error => {
      console.log('Query error:', error);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}></View>
      <Image source={require('../assets/logo_transparent.png')} style={styles.image} />
      <TextInput
        style={styles.input}
        placeholder="Email or Username" // Modify the placeholder
        onChangeText={text => setEmailOrUsername(text)}
        value={emailOrUsername}
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
      <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
    marginBottom: 15,
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

export default LoginScreen;