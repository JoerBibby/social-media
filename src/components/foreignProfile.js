import React from "react";
import {firestore} from "../index";
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import { Post } from "./postsFeed";
import {FaVenusMars, FaMapMarkerAlt, FaAddressCard} from "react-icons/fa";

class ForeignProfile extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            username: "",
            gender: "",
            about: "",
            location: "",
            photoUrl: "",
            loaded: false,
            posts: []
        }
        
       
    }
    
    componentDidMount() {
        let docRef = firestore.collection("users").doc(this.props.email);
        let postsRef = firestore.collection("posts");
        let query = postsRef.where("user", "==", this.props.user);

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
        .then(query.get()
        .then((querySnapshot) =>{
            querySnapshot.forEach((doc) => {
                this.setState(state => {
                    let posts = [...state.posts, doc.data()];
                    return {
                        posts: posts
                    };
                });

            });
            
        }))
        

        
        
    }    
   
  
    
    render() { 
        if (this.state.loaded){ 
            return (
                <div>
                    <Card border="primary" style={{ width: "18rem ", marginLeft: "1em"}}>
                        
                        <Card.Body>
                            <Card.Title>{this.state.username}  </Card.Title>
                            <Image src={this.state.photoUrl} roundedCircle style={{marginBottom: "1em", maxWidth: "100%", maxHeight: "100%"}} />
                            <Card.Text className="profileText" >
                                <FaVenusMars />
                                {"     " + this.state.gender}
                            </Card.Text >
                            <Card.Text className="profileText" >
                                <FaMapMarkerAlt />
                                {"     " + this.state.location}
                            </Card.Text>
                            <Card.Text className="profileText" >
                                <FaAddressCard />
                                {"     " + this.state.about}
                            </Card.Text>
                              
                            
                        </Card.Body>
                    </Card>

                    <div>                
                        <div>{this.state.posts && this.state.posts.map(post=> <Post key={post.id} post={post}  />)}</div>
                    </div>
                </div>
            );
        }else{
            return (
                <div>
                    <div>loading...</div>
                    
                </div>
            )
        }
    }
}

export default ForeignProfile;