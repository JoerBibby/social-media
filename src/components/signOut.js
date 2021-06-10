import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import Button from 'react-bootstrap/Button';


const SignOut = ({ setLoggedIn }) => {

    const signOut = () => {
        firebase.auth()
            .signOut();
        setLoggedIn(false);
    }


    return (
        <Button variant="light" onClick={signOut}>Sign Out</Button>
    )
}

export default SignOut;