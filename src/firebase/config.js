import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCN8mEpSvxEqWFS2pCQ51AX5yefpZc2oA8",
  authDomain: "atarax-f34e8.firebaseapp.com",
  projectId: "atarax-f34e8",
  storageBucket: "atarax-f34e8.firebasestorage.app",
  messagingSenderId: "603644932486",
  appId: "1:603644932486:web:ea59edb7122d0979ba7c07",
  measurementId: "G-VD5NYR00LN",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });
