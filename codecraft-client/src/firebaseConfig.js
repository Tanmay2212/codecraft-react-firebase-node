// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIUBAv6Y6Z1hQhvTHDpp8VUroOi5jzg6c",
  authDomain: "codecraft-8d2f2.firebaseapp.com",
  projectId: "codecraft-8d2f2",
  storageBucket: "codecraft-8d2f2.firebasestorage.app",
  messagingSenderId: "512806447633",
  appId: "1:512806447633:web:7ff404b3d8fc511de29fb0",
  measurementId: "G-W3MS3MBL3Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);