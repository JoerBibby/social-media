import React, { useEffect, useState } from "react";
import { firestore } from '../index';
import ChatWindow from "./chatWindow";


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
                {friends && friends.map(friend => <div className="friend" onClick={() => setSelectedFriend(friend)}  key={friend}>{friend}</div>)}
            </div>
            <div>
                <ChatWindow friend={selectedFriend} user={props.user} />
            </div>

        </div>
    );
}






export default FriendList;