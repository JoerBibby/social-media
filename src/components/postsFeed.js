

import React, { useEffect, useState } from "react";

import { useCollectionData } from "react-firebase-hooks/firestore";

import Card from 'react-bootstrap/Card'

import firebase from "firebase/app";

import { firestore, auth } from "../index";

import Image from 'react-bootstrap/Image';

import Form from 'react-bootstrap/Form'

import Button from 'react-bootstrap/Button'

import { FaThumbsUp, FaPlus } from "react-icons/fa";

import Modal from 'react-bootstrap/Modal'

import ForeignProfile from "./foreignProfile";



// grabs recent posts from firestore, renders them via .map() into post component below
const PostsFeed = (props) => {

  

    

    var postsRef = firestore.collection("posts");

    var query = postsRef.orderBy("createdAt", "desc");
    // get documents in the posts collection ordered by creation time. This hook also fires if any changes to the collection is made 
    // so the posts appear in realtime 
    var [posts] = useCollectionData(query, { idField: "id" });
    //pass all data through to Post component for rendering 
    return (
        <div>
            <div>{posts && posts.map(post => <Post user={props.user} key={post.id} post={post} />)}</div>
        </div>

    )
}
    // change post over to functional component


class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: ""
        }
        this.takeComment = this.takeComment.bind(this);
        this.storeComment = this.storeComment.bind(this);
        this.like = this.like.bind(this);
        this.addFriend = this.addFriend.bind(this);       
    }

    
    // take text input so that it can be uploaded as comment 
    takeComment(e) {
        this.setState({
            comment: e.target.value
        });

    }



    storeComment(e) {
        e.preventDefault();
        var postRef = firestore.collection("posts").doc(this.props.post.id);
        var comment = {
            user: this.props.user.username,
            photoUrl: this.props.user.photoUrl,
            body: this.state.comment
        };
        // add the comment to an array in the post document 
        postRef.update({
            comments: firebase.firestore.FieldValue.arrayUnion(comment)

        });
        
    }

    like() {
        var postRef = firestore.collection("posts").doc(this.props.post.id);
        // add the user to an array and display length of array for likes rather than increment a value so that a user can only like a post once
        postRef.update({
            likes: firebase.firestore.FieldValue.arrayUnion(this.state.username)
        });
        
    }
    // need email, username, picture of both users here.
    // need to add those as objects to friends array but they still need to be ordered by a value (probably still email).
    addFriend(){
        var requester = {
            email: this.props.user.email,
            username: this.props.user.username,
            photoUrl: this.props.user.photoUrl
        }
        // need to get username, photo from the post.
        var reciever = {
            email: this.props.post.email,
            username: this.props.post.user,
            photoUrl: this.props.post.profilePic
        }

        

        var recieverRef = firestore.collection("users").doc(this.props.post.email);
        
        recieverRef.update({
            friends: firebase.firestore.FieldValue.arrayUnion(requester)
        });

        var requesterRef = firestore.collection("users").doc(this.props.user.email);

        requesterRef.update({
            friends: firebase.firestore.FieldValue.arrayUnion(reciever)
        });

        var usersArray = [this.props.post.email, this.props.user.email];
        usersArray = usersArray.sort();
        
        firestore.collection("chats").add({
            messages: [],
            user0: usersArray[0],
            user1: usersArray[1]
        })
        

       
    }

    //conditionally render depending on if the post contains an image or not
    render() {

        // if (this.props.post.imageUrl) {
            return (
                <Card border="primary" style={{ width: "18rem ", margin: "1em" }}>


                    
                    <ProfileModal email={this.props.post.email}  profilePic={this.props.post.profilePic} user={this.props.post.user} />
                    <Button variant="primary" onClick={this.addFriend}>
                    Add Friend
                    {" "}
                    <FaPlus />
                </Button>
                    <img src={this.props.post.imageUrl} alt=" " />

                    <Card.Body>

                        <Card.Text>{this.props.post.body}</Card.Text>
                        <small className="text-muted">
                            {this.props.post.createdAt.toDate().toString()}
                        </small>


                        <Form style={{ paddingTop: "1em" }} onSubmit={this.storeComment}>
                            <Form.Group>
                                <Form.Control value={this.state.comment} onChange={this.takeComment} placeholder="share your thoughts" />
                            </Form.Group>

                            <Button variant="primary" type="submit">Post Comment</Button>
                            {" "}


                            <Button variant="primary" type="button" onClick={this.like}>
                                <FaThumbsUp />
                            </Button>


                            <span style={{ marginLeft: "1em" }}>{this.props.post.likes.length}</span>



                        </Form>

                        <div>
                            {this.props.post.comments && this.props.post.comments.map(comment =>
                                <div  style={{ margin: "0.5em" }}>
                                    <Card.Header style={{ float: "right", marginBottom: "0.5em" }} >
                                        <Image src={comment.photoUrl} roundedCircle style={{ marginRight: "1em", maxWidth: "25%", maxHeight: "25%" }} />
                                        {comment.user}
                                    </Card.Header>
                                    <Card.Text >{comment.body}</Card.Text>
                                </div>)}
                        </div>

                    </Card.Body>
                </Card>
            )
        
    }
}

function ProfileModal(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    

    return (
        <>
            {/* header showing username and profile picture goes at the top of posts, if clicked modal pops up  */}
            <Card.Header onClick={handleShow} style={{ float: "right", fontWeight: "bold", cursor: "pointer" }}>
                <Image src={props.profilePic} roundedCircle style={{ marginRight: "1em", maxHeight: "100px" }} />
                {props.user}
                
            </Card.Header>

            <Modal show={show} onHide={handleClose}>

                <Modal.Body style={{ margin: "auto" }} >
                    {/* this component shows the profile and post history of the user that made the post */}
                    <ForeignProfile style={{ margin: "auto" }} email={props.email} user={props.user} />
                </Modal.Body>

            </Modal>
        </>
    );
}





export { PostsFeed, Post };