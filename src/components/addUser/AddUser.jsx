import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import "./addUser.css";
import { db } from "../../lib/Firebase";
import { useState } from "react";
import { useUserStore } from "../../lib/userStore";
import { v4 as uuid } from "uuid";

const AddUser = () => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();


  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username").trim();

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser({
          ...querySnapShot.docs[0].data(),
          id: querySnapShot.docs[0].id,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async () => {

    const chatRef = collection(db, "chats")
    const userChatsRef = collection(db, "userchats")

    if (!user) return;

    try {
      // Create chat ID
      const chatId = uuid();
      const newChatRef = doc(chatRef)

      // Create empty chat document
      await setDoc(doc(db, "newChatRef", chatId), {
        createdAt : serverTimestamp(),
        messages: [],
      });

    await updateDoc(doc(userChatsRef, user.id), {
      chats:arrayUnion({
        chatId:newChatRef.id,
        lastMessage:"",
        receiverId:currentUser.id,
        updatedAt: Date.now()
      })
    })


      // Add chat to current user
      await updateDoc(doc(db, "userchats", currentUser.id), {
        chats: arrayUnion({
          chatId,
          receiverId: user.id,
          lastMessage: "",
          updatedAt: Date.now(),
        }),
      });

      // Add chat to other user
      await updateDoc(doc(db, "userchats", user.id), {
        chats: arrayUnion({
          chatId,
          receiverId: currentUser.id,
          lastMessage: "",
          updatedAt: Date.now(),
        }),
      });

      setUser(null);
      alert("User added to your chats!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" name="username" placeholder="Username" />
        <button type="submit">Search</button>
      </form>

      {user && (
        <div className="user">
          <div className="user-detail">
            <img src="/avatar.png" alt="Avatar" />
            <span className="username">{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
