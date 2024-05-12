import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBdTXD3uvmD9INafLtUCmwWh-qEq_PIGGw",
    authDomain: "chat-40359.firebaseapp.com",
    projectId: "chat-40359",
    storageBucket: "chat-40359.appspot.com",
    messagingSenderId: "383826466003",
    appId: "1:383826466003:web:05e1ef223cb6c58f3c3026"
  };
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const provider = new firebase.auth.GoogleAuthProvider();

