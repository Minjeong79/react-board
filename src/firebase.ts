// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
//회원가입, 로그인을 하기 위해 사용
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAV5c_HRNB9MW5ckdGVeUAwU6wuOBp-l18",
  authDomain: "board-bff0f.firebaseapp.com",
  projectId: "board-bff0f",
  storageBucket: "board-bff0f.appspot.com",
  messagingSenderId: "542556625164",
  appId: "1:542556625164:web:cfe3de7853587ed5f3d129",
  measurementId: "G-QQPTPMZE1Q"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

//이미지 업로드위해
const firestore = getFirestore(firebaseApp);
const storageApp = getStorage(firebaseApp);

const appAuth = getAuth(firebaseApp);

const database = getDatabase(firebaseApp);

export { appAuth, firestore, storageApp, firebaseApp };
