import React, { useEffect, useState } from "react";
import { firestore } from '../index';
import ChatWindow from "./chatWindow";
import Image from 'react-bootstrap/Image';


const FriendList = (props) => {

    const [friends, setFriends] = useState(null);

    const [selectedFriend, setSelectedFriend] = useState(null);

    useEffect(() => {
        var userRef = firestore.collection("users").doc(props.user.email);
        userRef.get()
            .then((doc) => {
                let data = doc.data();
                setFriends(data.friends);
            })
    });

    


    return (
        <div>
            <div>
                <h3>Friend list</h3>
            </div>
            <div>
                {friends && friends.map(friend => 
                <div className="friend" onClick={() => setSelectedFriend(friend.email)}  key={friend.email}>
                    <Image src={friend.photoUrl} roundedCircle style={{ maxHeight: "40px" }} />
                    <p style={{marginLeft: "5px"}} >
                        {friend.username}
                    </p>
                    
                </div>)}
            </div>
            <div>
                <h4>Instant Messenger</h4>
            </div>
            <div>
                <ChatWindow friend={selectedFriend} user={props.user} />
            </div>

        </div>
    );
}






export default FriendList;