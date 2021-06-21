import React, { useEffect, useState } from 'react';
import { firestore } from '../index';
import firebase from 'firebase';
import Form from 'react-bootstrap/Form'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'






const ChatWindow = (props) => {

    const [messages, setMessages] = useState([]);

    const [newMessage, setNewMessage] = useState("");

    const [doc, setDoc] = useState(null);

    // const chatsRef = firestore.collection("chats");
    // const query = chatsRef.where("participants", "array-contains", props.user.email).limit(1);



    useEffect(() => {
        if (props.friend) {
            var usersArray = [props.user.email, props.friend];
            usersArray = usersArray.sort();
            var chatsRef = firestore.collection("chats");
            var query = chatsRef.where("user1", "==", usersArray[0])
                .where("user2", "==", usersArray[1]).limit(1);
                
            query.get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        setDoc(doc.id);
                        let data = doc.data();
                        let array = data.messages;
                        setMessages(array);
                    })
                })
                .catch(() => {
                    chatsRef.add({
                        user1: usersArray[0],
                        user2: usersArray[1],
                        messages: []
                    })
                })
            console.log(props.friend);
        }
        
    }, [newMessage, props.user.email, props.friend]);

    const sendMessage = (e) => {
        e.preventDefault();
        var chatRef = firestore.collection("chats").doc(doc);
        var message = {
            username: props.user.username,
            photoUrl: props.user.photoUrl,
            body: newMessage
        }
        chatRef.update({
            messages: firebase.firestore.FieldValue.arrayUnion(message)
        });
        setNewMessage("");
    }

    return (
        <div style={{ border: "solid" }}>
            <div>
                {messages && messages.map((message) => <ChatMessage message={message} />)}
            </div>
            <Form onSubmit={sendMessage} >
                <Form.Control value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                <Button variant="primary" type="submit">Send</Button>
            </Form>
        </div>
    )
}

const ChatMessage = (props) => {


    return (
        <div className="chatMessage" >


            <Image src={props.message.photoUrl} roundedCircle style={{ maxHeight: "40px" }} />

            <p style={{ marginLeft: "5%" }} >
                {props.message.body}
            </p>

        </div>
    )
}

export default ChatWindow;

