// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB0ycQykElvIh8j1Qsq0TC4w4L9vQvC8bM",
    authDomain: "login-2a39c.firebaseapp.com",
    projectId: "login-2a39c",
    storageBucket: "login-2a39c.appspot.com",
    messagingSenderId: "329251653784",
    appId: "1:329251653784:web:ee6da39d43b82de6ebe8ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();