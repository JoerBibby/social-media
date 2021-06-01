import React, { useState } from "react";
import firebase from "firebase/app";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'


import { firestore, storage, auth } from "../index";



// component takes text and optionally an image, stores these in state, creates document for post in firestore, uploads image to storage.
class SubmitPost extends React.Component {
    constructor(props) {
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

    componentDidMount() {
        // get current user
        auth.onAuthStateChanged((user) => {
            if (user) {
                // get user data from firestore so it can be attached to the post 
                let docRef = firestore.collection("users").doc(user.email);
                docRef.get().then((doc) => {
                    let user = doc.data();
                    this.setState({
                        username: user.username,
                        photoUrl: user.photoUrl,
                        email: user.email
                    })
                });

            } else {
                console.log("whoops");
            }
        });
    }

    // take user input for text 
    takePost(e) {
        this.setState({
            formValue: e.target.value
        });

    }
    // take user input for image 
    imgStore(e) {
        if (e.target.files[0]) {
            this.setState({
                image: e.target.files[0]
            });

        }

    }


    storePost(e) {
        e.preventDefault();

        // create a unique meaningful id for the post 
        let date = new Date();
        let dateString = date.toString();
        let id = this.state.username + dateString;
                
        // upload function is different if post includes an image or not
        if (this.state.image) {
            // upload image to storage 
            let storageRef = storage.ref().child("postPics/" + this.state.image.name)
            storageRef.put(this.state.image).on(
                "state_changed",
                snapshot => { },
                error => { console.log(error); },
                () => {
                    storage
                        .ref()
                        .child("postPics/" + this.state.image.name)
                        .getDownloadURL()
                        .then(url => {
                            // once upload is done create firestore document for the post 
                            firestore.collection("posts").doc(id).set({
                                body: this.state.formValue,
                                createdAt: new firebase.firestore.Timestamp.fromDate(date),
                                user: this.state.username,
                                comments: [],
                                likes: [],
                                imageUrl: url,
                                profilePic: this.state.photoUrl,
                                email: this.state.email
                            });
                            // reset state (so that text input empties)
                            this.setState({
                                formValue: "",
                                image: null
                            });

                        });
                }
            );



        // if theres no photo, skip the storage part and just create the document 
        } else {
            firestore.collection("posts").doc(id).set({
                body: this.state.formValue,
                createdAt: new firebase.firestore.Timestamp.fromDate(date),
                user: this.state.username,
                comments: [],
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


    render() {
        return (
            <div className="postForm">
                <Form onSubmit={this.storePost}>
                    <Form.Group>
                        <Form.File onChange={this.imgStore} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Control value={this.state.formValue} onChange={this.takePost} />
                    </Form.Group>


                    <Button type="submit" variant="primary"  >post</Button>


                </Form>
            </div>
        );
    }
}

export default SubmitPost;