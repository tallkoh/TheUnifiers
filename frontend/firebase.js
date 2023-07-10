// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADlc9ahbhAc7i0cqxN-lC3EKpyIyeF_uo",
  authDomain: "unified-acf08.firebaseapp.com",
  projectId: "unified-acf08",
  storageBucket: "unified-acf08.appspot.com",
  messagingSenderId: "977370261294",
  appId: "1:977370261294:web:c93f116e268aa4b485fcbf",
  measurementId: "G-C3S6MF1GMP"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const firestore = firebase.firestore();
const auth = firebase.auth();

export { firestore };
export { auth };