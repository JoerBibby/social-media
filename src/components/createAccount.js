import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { firestore, storage } from "../index";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';



const CreateAccount = ( {setLoggedIn} ) => {

    var [email, setEmail] = useState("");
    var [pass, setPass] = useState("");
    var [username, setUsername] = useState("");
    var [photo, setPhoto] = useState(null);
    var [about, setAbout] = useState("");
    var [gender, setGender] = useState("Male");
    var [country, setCountry] = useState("");
    var [city, setCity] = useState("");


   
    
    const takeEmail = (e) => {
        setEmail(e.target.value);
    }

    const takePass = (e) => {
        setPass(e.target.value);
    }

    const takeUsername = (e) => {
        setUsername(e.target.value);
    }

    const takePhoto = (e) => {
        setPhoto(e.target.files[0]);
    }

    const takeAbout = (e) => {
        setAbout(e.target.value);
    }

    const takeGender = (e) => {
        setGender(e.target.value);
    }

    const takeCountry = (e) => {
        setCountry(e.target.value);
    }

    const takeCity = (e) => {
        setCity(e.target.value);
    }
    

  

    const makeUser = () => {

        let storageRef = storage.ref().child("profilePics/" + photo.name);

        storageRef.put(photo).on(
            "state_changed",
            snapshot => {},
            error => {console.log(error);},
            () => {
                storageRef.getDownloadURL()
                .then((url) => {
                    firestore.collection("users").doc(email).set({
                        email: email,
                        pass : pass,
                        photoUrl : url,
                        about : about,
                        gender: gender,
                        location: city + ", " + country,
                        username: username
                    });
                    
                })
            }
        )

        firebase.auth().createUserWithEmailAndPassword(email, pass)
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

                <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control placeholder="Username" onChange={takeUsername} ></Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.File label="Choose profile picture" onChange={takePhoto} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>About</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="write a little about yourself" onChange={takeAbout} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Gender</Form.Label>
                    <Form.Control as="select" onChange={takeGender} >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Trans/Non-binary</option>
                        <option>Prefer not to say</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Location</Form.Label>
                    <Row>
                        <Col>
                            <Form.Control placeholder="Country" onChange={takeCountry} />
                        </Col>
                        <Col>
                            <Form.Control placeholder="City" onChange={takeCity} />
                        </Col>
                    </Row>
                </Form.Group>

                <Button variant="primary" onClick={makeUser}>
                    Create account
                </Button>
                
            
                
            </Form>

           
        </div>
    )
}

export default CreateAccount;