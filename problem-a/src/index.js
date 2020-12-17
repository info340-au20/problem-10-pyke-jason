import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css"; //using FA 4.7 atm

import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/database';

import App from "./App"; //so our app styling is applied second

//import and configure firebase here
const firebaseConfig = {
  apiKey: "AIzaSyCASjuBWQ0VT1j-Izm83AW0Nv9N5r03sJ4",
  authDomain: "chirper-pykeja.firebaseapp.com",
  projectId: "chirper-pykeja",
  storageBucket: "chirper-pykeja.appspot.com",
  messagingSenderId: "679185134236",
  appId: "1:679185134236:web:a4029708ab81fccd9bf359",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(<App />, document.getElementById("root"));
