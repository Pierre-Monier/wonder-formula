// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3WEu8_HXbI2Xx76JdPnFwFNEv7uxMkNc",
  authDomain: "wonder-formula.firebaseapp.com",
  projectId: "wonder-formula",
  storageBucket: "wonder-formula.appspot.com",
  messagingSenderId: "623944834472",
  appId: "1:623944834472:web:43be43c5593d993e22919d",
  measurementId: "G-4L84PHQE9Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app);
