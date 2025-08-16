// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Replace the values below with your Firebase app config
const firebaseConfig = {
  apiKey: "AIzaSyDayWljeJt2OMin29GvrDv14_ZWMJbtguI",
  authDomain: "add-task-ab038.firebaseapp.com",
  projectId: "add-task-ab038",
  storageBucket: "add-task-ab038.firebasestorage.app",
  messagingSenderId: "1067854402217",
  appId: "1:1067854402217:web:18fc59f17f57fe2bc48fb8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
