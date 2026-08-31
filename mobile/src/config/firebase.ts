// src/config/firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB3-tfKlFWZ-fEpN-escaVFXzwhgi4THkY",
  authDomain: "xau-trading-signals.firebaseapp.com",
  projectId: "xau-trading-signals",
  storageBucket: "xau-trading-signals.firebasestorage.app",
  messagingSenderId: "855827056347",
  appId: "1:855827056347:web:b584ede770b104388a6efe",
  measurementId: "G-ETX7G6NSM1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;


