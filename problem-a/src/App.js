import React, { useState, useEffect } from "react";
import SignUpForm from "./components/signup/SignUpForm";
import firebase from "firebase/app";
import ChirperHeader from "./components/chirper/ChirperHeader";
import ChirpBox from "./components/chirper/ChirpBox";
import ChirpList from "./components/chirper/ChirpList";

function App(props) {
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);


  //A callback function for registering new users
  const handleSignUp = (email, password, handle, avatar) => {
    setErrorMessage(null); //clear any old errors
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        return userCredential.user
          .updateProfile({ displayName: handle, photoURL: avatar })
          .then(() => setUser(user));
      })
      .catch((err) => setErrorMessage(err.message));
  };

  //A callback function for logging in existing users
  const handleSignIn = (email, password) => {
    setErrorMessage(null); //clear any old errors
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((err) => setErrorMessage(err.message));
  };

  //A callback function for logging out the current user
  const handleSignOut = () => {
    setErrorMessage(null); //clear any old errors
    firebase
      .auth()
      .signOut()
      .catch((err) => setErrorMessage(err));
  };

  useEffect(() => {
    const unregisterAuth = firebase
      .auth()
      .onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });

    return function cleanup() {
      unregisterAuth();
    };
  }, []); // only run hook on first load
  
  if (isLoading) {
    return (
      <div className="text-center">
        <i className="fa fa-spinner fa-spin fa-3x" aria-label="Connecting..."></i>
      </div>
    );
  }

  let content = null; //content to render

  if (!user) {
    //if logged out, show signup form
    content = (
      <div className="container">
        <h1>Sign Up</h1>
        <SignUpForm
          signUpCallback={handleSignUp}
          signInCallback={handleSignIn}
        />
      </div>
    );
  } else {
    //if logged in, show welcome message
    content = (
      <div>
        <ChirperHeader user={user}>
          {/* log out button is child element */}
          {user && (
            <button className="btn btn-warning" onClick={handleSignOut}>
              Log Out {user.displayName}
            </button>
          )}
        </ChirperHeader>
        <ChirpBox currentUser={user}/>
        <ChirpList currentUser={user}/>
      </div>
    );
  }

  return (
    <div>
      {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
      {content}
    </div>
  );
}

//A component to display a welcome message to a `user` prop (for readability)
function WelcomeHeader(props) {
  return (
    <header className="container">
      <h1>
        Welcome {props.user.displayName}!{" "}
        <img
          className="avatar"
          src={props.user.photoURL}
          alt={props.user.displayName}
        />
      </h1>
      {props.children} {/* for button */}
    </header>
  );
}

export default App;
