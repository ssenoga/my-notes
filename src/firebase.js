import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBamEQESxLpEzJP_QtiCeZPJjyW60eSUMQ",
  authDomain: "my-notes-app-be212.firebaseapp.com",
  databaseURL: "https://my-notes-app-be212.firebaseio.com",
  projectId: "my-notes-app-be212",
  storageBucket: "my-notes-app-be212.appspot.com",
  messagingSenderId: "1020095235831",
  appId: "1:1020095235831:web:7ab52b3e7151367d2135f2",
  measurementId: "G-EXX1NZQ69K"
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

export { db, auth };
