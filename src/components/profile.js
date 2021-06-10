import React from "react";

import "firebase/auth";
import { firestore, auth } from "../index"
import Card from 'react-bootstrap/Card'

import Image from 'react-bootstrap/Image';
import { FaVenusMars, FaMapMarkerAlt, FaAddressCard } from "react-icons/fa";


class Profile extends React.Component {
    constructor(props) {
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
    // get currently logged in user
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                // get document corresponding to user 
                let docRef = firestore.collection("users").doc(user.email);
                docRef.get().then((doc) => {
                    let user = doc.data();
                    // store all data fields in state so that they can be rendered. Set loaded to true so that data renders instead of loading message
                    this.setState({
                        username: user.username,
                        gender: user.gender,
                        about: user.about,
                        location: user.location,
                        photoUrl: user.photoUrl,
                        loaded: true
                    })
                }).catch(err => console.log(err))


            } else {
                console.log("whoops");
            }
        });




    }



    render() {
        // only render once data has come in, to avoid errors 
        if (this.state.loaded) {
            return (
                <Card border="primary" style={{ width: "18rem " }}>

                    <Card.Body>
                        <Card.Title>{this.state.username}  </Card.Title>
                        <Image src={this.state.photoUrl} roundedCircle style={{ marginBottom: "1em", maxWidth: "100%", maxHeight: "100%" }} />
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
        } else {
            return (
                <div>
                    <div>loading...</div>

                </div>
            )
        }
    }
}
export default Profile;