// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6vjygCkup4f07AebWQU7xKIPCKMAwta8",
  authDomain: "the-unifiers.firebaseapp.com",
  projectId: "the-unifiers",
  storageBucket: "the-unifiers.appspot.com",
  messagingSenderId: "982432716226",
  appId: "1:982432716226:web:3726f7f517aaba037bb25b",
  measurementId: "G-9FXDFN6X30"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const auth = firebase.auth();

export { auth };