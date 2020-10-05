import firebase from 'firebase'
require('@firebase/firestore');

var firebaseConfig = {
    apiKey: "AIzaSyApeBaKSzAqU9bfgK0jWCWE_S6pmDJmOzM",
    authDomain: "nps-library.firebaseapp.com",
    databaseURL: "https://nps-library.firebaseio.com",
    projectId: "nps-library",
    storageBucket: "nps-library.appspot.com",
    messagingSenderId: "1050262142978",
    appId: "1:1050262142978:web:c0303af5586db49fea271b"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();