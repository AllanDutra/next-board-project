import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgkpwSjsjpCxXbt8EragJi0V_C2zq2sGw",
  authDomain: "boardapp-ebed7.firebaseapp.com",
  projectId: "boardapp-ebed7",
  storageBucket: "boardapp-ebed7.appspot.com",
  messagingSenderId: "86724266272",
  appId: "1:86724266272:web:3a4e674e5d9590e367ef45",
  measurementId: "G-BQXF9N8B2B",
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export default firebase;
