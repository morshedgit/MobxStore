// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEPbjTneKWQcvtw7MAnlqyoE-UZjWhUhA",
  authDomain: "mystartup-4d959.firebaseapp.com",
  projectId: "mystartup-4d959",
  storageBucket: "mystartup-4d959.appspot.com",
  messagingSenderId: "552659198933",
  appId: "1:552659198933:web:9abfca0d535518e20d135c",
  measurementId: "G-BLNJFM3BCE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const addUser = async (d: any) => {
  try {
    const docRef = await addDoc(collection(db, "users"), d);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const getUsers = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
};
