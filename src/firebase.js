import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADkAgveVJtQZnCO-Hea4PlbvGCKK2E7hg",
  authDomain: "loker-lumajang.firebaseapp.com",
  projectId: "loker-lumajang",
  storageBucket: "loker-lumajang.firebasestorage.app",
  messagingSenderId: "815271096812",
  appId: "1:815271096812:web:81b5e1de2e2cedf78210c9",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const appId = "loker-lumajang-id";
