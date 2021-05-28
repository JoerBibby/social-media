

import React, { useState, useRef } from "react";

import { useCollectionData } from "react-firebase-hooks/firestore";

import Card from 'react-bootstrap/Card'

import firebase from "firebase/app";

import { firestore, auth } from  "../index";

import Image, { propTypes } from 'react-bootstrap/Image';

import Form from 'react-bootstrap/Form'

import Button from 'react-bootstrap/Button'

import {FaThumbsUp} from "react-icons/fa";

import Modal from 'react-bootstrap/Modal'

import Profile from "./profile";

import ForeignProfile from "./foreignProfile";



// grabs recent posts from firestore, renders them via .map() into post component below
const PostsFeed = () => {
    
    

    var postsRef = firestore.collection("posts");

    var query = postsRef.orderBy("createdAt");

    var [posts] = useCollectionData(query, {idField: "id"});

    
    
   
    
    
    
        return (
            <div>
                
                <div>{posts && posts.map(post=> <Post key={post.id} post={post}  />)}</div>
            </div>
           
        )
    }




  class Post extends React.Component{
      constructor(props){
          super(props);
          this.state = {
              comment: "",
              username: "",
              photoUrl: "",
              comments: this.props.post.comments,
              likes: this.props.post.likes
          }
          this.takeComment = this.takeComment.bind(this);
          this.storeComment = this.storeComment.bind(this);
          this.like = this.like.bind(this);
          this.post = {
            body: this.props.post.body,
            imageUrl: this.props.post.imageUrl,
            profilePic: this.props.post.profilePic,
            email: this.props.post.email,
            user: this.props.post.user,
            createdAt: this.props.post.createdAt.toDate().toString(),
            id: this.props.post.id
          }

      }
    // comment and like functionality changes these properties in the specific firestore doc for this post 
   componentDidMount(){
    auth.onAuthStateChanged((user) => {
        if(user){
            let docRef = firestore.collection("users").doc(user.email);
            docRef.get().then((doc) => {
                let user = doc.data();
                this.setState({
                 username: user.username,
                 photoUrl: user.photoUrl 
                })
            });
            
        }else{
            console.log("whoops");
        }
    });
    
   }

    takeComment(e){
        this.setState({
            comment: e.target.value
        });
        
    }

    
    
    storeComment(e){
        e.preventDefault();
        var postRef = firestore.collection("posts").doc(this.post.id);
        var comment = {
            user: this.state.username,
                photoUrl: this.state.photoUrl,
                body: this.state.comment
        };
        postRef.update({
            comments: firebase.firestore.FieldValue.arrayUnion(comment)
                
        });
        postRef.get().then((doc) => {
            let post = doc.data();
            this.setState({
                comment: "",
                comments: post.comments
            });
        })
        
        
    }

    like(){
        var postRef = firestore.collection("posts").doc(this.post.id);
        postRef.update({
            likes: firebase.firestore.FieldValue.arrayUnion(this.state.username)
        });
        postRef.get().then((doc) => {
            let post = doc.data();
            this.setState({
                likes: post.likes
            });
        })
    }

    
        
   //conditionally render dpeending on if the post contains an image or not
   render(){
            
   if(this.post.imageUrl){
    return (
        <Card border="primary" style={{ width: "18rem ", margin: "1em"}}>
            <img src={this.post.imageUrl} alt="post"/>
                          
            <Card.Header style={{float: "right", fontWeight: "bold"}}>
                <Image src={this.post.profilePic} roundedCircle style={{marginRight: "1em", maxWidth: "50%", maxHeight: "50%"}} />
                {this.post.user}
            </Card.Header>
                          
            <Card.Body>
            
                <Card.Text>{this.post.body}</Card.Text>  
                <small className="text-muted">
                    {this.post.createdAt}
                </small> 
                
            
                <Form style={{paddingTop: "1em"}} onSubmit={this.storeComment}>
                    <Form.Group>
                        <Form.Control value={this.state.comment} onChange={this.takeComment} placeholder="share your thoughts" />
                    </Form.Group>
                    
                    <Button  variant="primary" type="submit">Post Comment</Button>
                    {" "}

                    
                    <Button variant="primary" type="button" onClick={this.like}>
                        <FaThumbsUp />                        
                    </Button>
                    
                    
                    <span style={{marginLeft: "1em"}}>{this.state.likes.length}</span>

                    
                    
                </Form>
                
                <div>
                    {this.state.comments && this.state.comments.map(comment => 
                    <div style={{margin: "0.5em"}}>
                        <Card.Header style={{float: "right", marginBottom: "0.5em"}} >
                        <Image src={comment.photoUrl} roundedCircle style={{marginRight: "1em", maxWidth: "25%", maxHeight: "25%"}} />
                        {comment.user}
                        </Card.Header>
                        <Card.Text >{comment.body}</Card.Text>
                    </div> )}
                </div>  
                
            </Card.Body>
        </Card>
    )
   }else{
    return (
        
        <Card border="primary" style={{ width: "18rem ", margin: "1em"}}>
            
            {/* <Card.Header style={{float: "right", fontWeight: "bold"}}>
                <Image src={this.post.profilePic} roundedCircle style={{marginRight: "1em", maxWidth: "50%", maxHeight: "50%"}} />
                {this.post.user}
            </Card.Header> */}

            <ProfileModal email={this.post.email} profilePic={this.post.profilePic} user={this.post.user} />
                          
            <Card.Body>
            
                <Card.Text>{this.post.body}</Card.Text>  
                <small className="text-muted">
                    {this.post.createdAt}
                </small> 
                
                
            
                <Form style={{paddingTop: "1em"}} onSubmit={this.storeComment}>
                    <Form.Group>
                        <Form.Control value={this.state.comment} onChange={this.takeComment} placeholder="share your thoughts" />
                    </Form.Group>
                    
                    <Button  variant="primary" type="submit">Post Comment</Button>
                    {" "}

                    
                    <Button variant="primary" type="button" onClick={this.like}>
                        <FaThumbsUp />                        
                    </Button>
                    
                    
                    <span style={{marginLeft: "1em"}}>{this.state.likes.length}</span>

                    
                    
                </Form>

               
                
                
        <div>
            {this.state.comments && this.state.comments.map(comment => 
                <div style={{margin: "0.5em"}}>
                    <Card.Header style={{float: "right", marginBottom: "0.5em"}} >
                    <Image src={comment.photoUrl} roundedCircle style={{marginRight: "1em", maxWidth: "25%", maxHeight: "25%"}} />
                    {comment.user}
                    </Card.Header>
                    <Card.Text >{comment.body}</Card.Text>
                </div> )}
        </div>
                
            </Card.Body>
        </Card>

        
    
    )
   }
   }
  }
 
  function ProfileModal({profilePic, user, email}) {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
        <Card.Header onClick={handleShow} style={{float: "right", fontWeight: "bold", cursor: "pointer"}}>
                <Image src={profilePic} roundedCircle style={{marginRight: "1em", maxWidth: "50%", maxHeight: "50%"}} />
                {user}
            </Card.Header>
  
        <Modal show={show} onHide={handleClose}>
          
          <Modal.Body style={{margin: "auto"}} >
              <ForeignProfile style={{margin: "auto"}} email={email} user={user} />
          </Modal.Body>
          
        </Modal>
      </>
    );
  }
   
  
    


export {PostsFeed, Post};