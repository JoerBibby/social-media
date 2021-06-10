import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from "firebase/app";
import 'firebase/storage';
import "firebase/firestore";
import "firebase/auth";

import 'bootstrap/dist/js/bootstrap.bundle.min';

var firebaseConfig = {
  apiKey: "AIzaSyB8uAYm_rCQ3DZm7x_kx3qjGnRLuNNFNCA",
  authDomain: "social-media-app-6938c.firebaseapp.com",
  projectId: "social-media-app-6938c",
  storageBucket: "social-media-app-6938c.appspot.com",
  messagingSenderId: "772766390651",
  appId: "1:772766390651:web:a7eba344aad03079cd05de"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const firestore = firebase.firestore();
const auth = firebase.auth();


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export {storage, firestore, auth};
