import React, { useState } from "react";

import "firebase/auth";
import { storage, firestore, auth } from "../index"
import Card from 'react-bootstrap/Card'
import { render } from "@testing-library/react";
import Image from 'react-bootstrap/Image';
import {FaVenusMars, FaMapMarkerAlt, FaAddressCard} from "react-icons/fa";


class Profile extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            username: "",
            gender: "",
            about: "",
            location: "",
            photoUrl: "",
            loaded: false
        }
        
       
    }
    
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if(user){
                let docRef = firestore.collection("users").doc(user.email);
                docRef.get().then((doc) => {
                    let user = doc.data();
                    
                    this.setState({
                        username: user.username,
                        gender: user.gender,
                        about: user.about,
                        location: user.location,
                        photoUrl: user.photoUrl,
                        loaded: true
                    })
                })
                
                
            }else{
                console.log("whoops");
            }
        });

     

        
    }    
   
    testFunction(){
        console.log(this.state);
    }
    
    render() { 
        if (this.state.loaded){ 
            return (
                <Card border="primary" style={{ width: "18rem "}}>
                    
                    <Card.Body>
                        <Card.Title>{this.state.username}  </Card.Title>
                        <Image src={this.state.photoUrl} roundedCircle style={{marginBottom: "1em", maxWidth: "100%", maxHeight: "100%"}} />
                        <Card.Text className="profileText" >
                            <FaVenusMars />
                            {"     " + this.state.gender}
                        </Card.Text>
                        <Card.Text className="profileText">
                            <FaMapMarkerAlt />
                            {"     " + this.state.location}
                        </Card.Text>
                        <Card.Text className="profileText">
                            <FaAddressCard />
                            {"     " + this.state.about}
                        </Card.Text>
                        
                        
                    </Card.Body>
                </Card>
            );
        }else{
            return (
                <div>
                    <div>loading...</div>
                    <button onClick={this.testFunction}>Test</button>
                </div>
            )
        }
    }
}
export default Profile;