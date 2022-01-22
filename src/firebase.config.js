import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQIkfp6qidhFmNstskKB2dyttvPz19LLY",
  authDomain: "react-notes-aafe8.firebaseapp.com",
  projectId: "react-notes-aafe8",
  storageBucket: "react-notes-aafe8.appspot.com",
  messagingSenderId: "414917523632",
  appId: "1:414917523632:web:1ed45a0da96f55d46e6375",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
