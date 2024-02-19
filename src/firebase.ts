// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
//회원가입, 로그인을 하기 위해 사용
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

//이미지 업로드위해
const firestore = getFirestore(firebaseApp);
const storageApp = getStorage(firebaseApp);

const appAuth = getAuth(firebaseApp);

const database = getDatabase(firebaseApp);

export { appAuth, firestore, storageApp, firebaseApp };
