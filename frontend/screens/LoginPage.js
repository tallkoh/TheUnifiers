import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Keyboard, KeyboardAvoidingView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from '../firebase';

const LoginScreen = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
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
          firestore
            .collection('users')
            .where('username', '==', emailOrUsername)
            .get()
            .then(querySnapshot => {
              if (querySnapshot.empty) {
                Alert.alert('User Not Found', 'Please check your email/username and try again.');
              } else {
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

  const handleInputFocus = () => {
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('../assets/logo_transparent.png')} style={styles.image} />
      </View>
      <TouchableOpacity activeOpacity={1} onPress={handleInputFocus} style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Email or Username"
          onChangeText={text => setEmailOrUsername(text)}
          value={emailOrUsername}
          autoCapitalize="none"
        />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={1} onPress={handleInputFocus} style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={text => setPassword(text)}
          value={password}
          autoCapitalize="none"
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  inputWrapper: {
    width: '80%',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 5,
  },
  buttonContainer: {
    width: '40%',
    marginTop: 15,
    padding: 15,
    backgroundColor: '#009688',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
