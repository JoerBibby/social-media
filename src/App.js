
import './App.css';


import SignIn from './components/signIn';

import SignOut from './components/signOut';
import Profile from './components/profile';
import SubmitPost from './components/submitPost';
import { PostsFeed } from './components/postsFeed';
import CreateAccount from "./components/createAccount";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';

import React, { useState } from 'react';




  
  
  


const App = () => {


  const [loggedIn, setLoggedIn] = useState(false);
  
 

  // if (user) {

  //   var userRef = firestore.collection("users").doc(user.email);
  //   userRef.get()
  //   .then((doc) => {
  //     setUserInfo(doc.data());
      
  //   })
  
    if(loggedIn){ 
      return (
        <Container fluid className="app" >
          <Row className="justify-content-md-centre">
            <Col>
              <SignOut setLoggedIn={setLoggedIn}/>
              <Profile />
              
            </Col>
            <Col md="auto">
              <div style={{margin: "auto"}}>
                <SubmitPost  />
              </div>
              <div style={{marginLeft: "20px"}}>
                <PostsFeed   />
              </div>
            </Col>
            <Col ></Col>
          </Row>
        </Container>
      );
    } else {
      return (
        <Container>
          <Row>
            <Col></Col>
            <Col >Logo and info coming soooon...</Col>
            <Col></Col>
          </Row>
          <Row>
            <Col>
              <h3>Already have an account? Sign in</h3>
              <SignIn setLoggedIn={setLoggedIn} />
            </Col>
            <Col>
              <h3>Don't have an account? Create one now</h3>
              <CreateAccount setLoggedIn={setLoggedIn} />
            </Col>
            
          </Row>
        </Container>
      );
    }
  
  
}

export default App;
