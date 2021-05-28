import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'




const SignIn = ( {setLoggedIn} ) => {

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

   
    
    const takeEmail = (e) => {
        setEmail(e.target.value);
    }

    const takePass = (e) => {
        setPass(e.target.value);
    }

   

    const signIn = () => {
        firebase.auth().signInWithEmailAndPassword(email, pass)
        .then(() => {
            setLoggedIn(true);
        })

        
        
    }

    return (
        
        <div>
            <Form>
                <Form.Group>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" onChange={takeEmail} />
                    <Form.Text className="text-muted">We'll never share your email with anyone else</Form.Text>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={takePass} />
                </Form.Group>

                
                <Button variant="primary" onClick={signIn}>
                    Sign in 
                </Button>
            </Form>

           
        </div>

        
    )
}


export default SignIn;