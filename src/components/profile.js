import React from "react";



import Card from 'react-bootstrap/Card'

import Image from 'react-bootstrap/Image';
import { FaVenusMars, FaMapMarkerAlt, FaAddressCard } from "react-icons/fa";




const Profile = (props) => {

    if (props.user) {
        return (
            <Card border="primary" style={{ width: "18rem " }}>

                        <Card.Body>
                            <Card.Title>{props.user.username}  </Card.Title>
                            <Image src={props.user.photoUrl} roundedCircle style={{ marginBottom: "1em", maxWidth: "100%", maxHeight: "100%" }} />
                            <Card.Text className="profileText" >
                                <FaVenusMars />
                                {"     " + props.user.gender}
                            </Card.Text>
                            <Card.Text className="profileText">
                                <FaMapMarkerAlt />
                                {"     " + props.user.location}
                            </Card.Text>
                            <Card.Text className="profileText">
                                <FaAddressCard />
                                {"     " + props.user.about}
                            </Card.Text>


                        </Card.Body>
                    </Card>
           

        );
    }
}




export default Profile;