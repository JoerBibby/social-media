import React, { useState } from "react";
import firebase from "firebase/app";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'


import { firestore, storage, auth } from "../index";



// component takes text and optionally an image, stores these in state, creates document for post in firestore, uploads image to storage.
class SubmitPost extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            formValue: "",
            image: null,
            email: "",
            username: "",
            photoUrl: ""
        }
        this.takePost = this.takePost.bind(this);
        this.storePost = this.storePost.bind(this);
        this.imgStore = this.imgStore.bind(this);
    }
    
    componentDidMount () {
       auth.onAuthStateChanged((user) => {
           if(user){
               let docRef = firestore.collection("users").doc(user.email);
               docRef.get().then((doc) => {
                   let user = doc.data();
                   this.setState({
                    username: user.username,
                    photoUrl: user.photoUrl,
                    email: user.email 
                   })
               });
               
           }else{
               console.log("whoops");
           }
       });
    }
    

    takePost(e){
        this.setState({
            formValue: e.target.value
        });
        
    }
   
    
    storePost (e) {
        e.preventDefault();
        
        
    // create a unique meaningful id for the post 
      
            let date = new Date();
            let dateString = date.toString();
            let id = this.state.username + dateString;
    // upload image to storage, then create document for post and assign the image url to it. or if no image just create the document        
            
        if (this.state.image){ 

            let storageRef = storage.ref().child("postPics/" + this.state.image.name)

            storageRef.put(this.state.image).on(
                "state_changed",
                snapshot => {},
                error => {console.log(error);},
                () => { 
                    storage
                        .ref()
                        .child("postPics/" + this.state.image.name)
                        .getDownloadURL()
                        .then(url => {
                            firestore.collection("posts").doc(id).set({
                                body: this.state.formValue,
                                createdAt: new firebase.firestore.Timestamp.fromDate(date),
                                user: this.state.username,
                                comments : [],
                                likes: [],
                                imageUrl: url,
                                profilePic: this.state.photoUrl,
                                email: this.state.email
                            });

                            this.setState({
                                formValue: "",
                                image: null
                            });
                            
                        });
                }
            );

           
            
            
        }else {
            firestore.collection("posts").doc(id).set({
                body: this.state.formValue,
                createdAt: new firebase.firestore.Timestamp.fromDate(date),
                user: this.state.username,
                comments : [],
                likes: [],
                imageUrl: "",
                profilePic: this.state.photoUrl,
                email: this.state.email
            });

            this.setState({
                formValue: "",
                image: null
            });
        }
            
        
    }

    
    

    imgStore (e) {
        if (e.target.files[0]){
            this.setState({
                image: e.target.files[0]
            });
            
        }
       
    }
    render() { 
        return (
        <div className="postForm">
            <Form  onSubmit={this.storePost}>
                <Form.Group>
                    <Form.File onChange={this.imgStore} />
                </Form.Group>
                
                <Form.Group>
                    <Form.Control  value={this.state.formValue} onChange={this.takePost} />
                </Form.Group>
                
                 
                <Button type="submit" variant="primary"  >post</Button>
                
                
            </Form>
        </div>
        );
    }
}

export default SubmitPost;