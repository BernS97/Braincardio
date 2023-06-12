import { initializeApp } from "firebase/app";

import { indexedDBLocalPersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyAPPE8kaG3rTGpYsyRbSWwtu_FpoExdOuU",
  authDomain: "braincard-e6c5e.firebaseapp.com",
  projectId: "braincard-e6c5e", 
  storageBucket: "braincard-e6c5e.appspot.com",
  messagingSenderId: "927691164263",
  appId: "1:927691164263:web:2ff4cd432637293826e2c2",
  measurementId: "G-LR3KWESQVM",
});

const db = getFirestore(firebaseApp);
const auth = initializeAuth(firebaseApp, {
  persistence: indexedDBLocalPersistence,
});

export { firebaseApp, db, auth };
