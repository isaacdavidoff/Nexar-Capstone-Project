import { initializeApp } from "firebase/app";
import{ getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey:"AIzaSyADvNo2ZwD7Ff6B8Ovd3Sr_ws2wKSbvv4I",
    authDomain:"nexar-ap.firebaseapp.com",
    projectId: "nexar-ap",
    storageBucket:"nexar-ap.firebasestorage.app",
    messagingSenderId:"538236174864",
    appId: "1:538236174864:web:8dc8f1d77d19da63a2c095",
    };

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const auth = getAuth(app);
export const db = getFirestore(app);