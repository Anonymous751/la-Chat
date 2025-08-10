import { useState, useEffect } from "react";
import "./chatList.css";
import AddUser from "../../addUser/AddUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, onSnapshot, getDoc, updateDoc, arrayRemove, deleteDoc } from "firebase/firestore";
import { db } from "../../../lib/Firebase";
import { useChatStore } from "../../../lib/chatStore";

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const { currentUser } = useUserStore();
  const { selectUser } = useChatStore();

  useEffect(() => {
    if (!currentUser?.id) return;

    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
      const items = res.data()?.chats || [];

      const promises = items.map(async (item) => {
        const userDocRef = doc(db, "users", item.receiverId);
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.data() || {};
        // Use photoURL or avatar fallback
        return {
          ...item,
          user: {
            ...userData,
            avatar: userData.photoURL || userData.avatar || "./avatar.png",
          },
        };
      });

      const chatData = await Promise.all(promises);
      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    });

    return () => unSub();
  }, [currentUser]);

  const handleDeleteChat = async (chat) => {
    if (!window.confirm(`Delete chat with ${chat.user?.username}?`)) return;

    try {
      await updateDoc(doc(db, "userchats", currentUser.id), {
        chats: arrayRemove({
          chatId: chat.chatId,
          receiverId: chat.receiverId,
          lastMessage: chat.lastMessage,
          updatedAt: chat.updatedAt,
        }),
      });

      await updateDoc(doc(db, "userchats", chat.receiverId), {
        chats: arrayRemove({
          chatId: chat.chatId,
          receiverId: currentUser.id,
          lastMessage: chat.lastMessage,
          updatedAt: chat.updatedAt,
        }),
      });

      await deleteDoc(doc(db, "chats", chat.chatId));

      setChats((prev) => prev.filter((c) => c.chatId !== chat.chatId));
    } catch (err) {
      console.error("Error deleting chat:", err);
    }
  };

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="search" />
          <input type="text" placeholder="Search" />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt={addMode ? "Close Add User" : "Add User"}
          className="add"
          onClick={() => setAddMode(!addMode)}
        />
      </div>

      {addMode && <AddUser />}

      <div className="chatItems">
        {chats.length === 0 ? (
          <p className="noChats">No chats yet</p>
        ) : (
          chats.map((chat) => (
            <div className="chatItem" key={chat.chatId}>
              <div
                className="userInfo"
                onClick={() => selectUser(currentUser.id, chat.user)}
              >
                <img src={chat.user.avatar} alt={chat.user?.username || "User"} />
                <div className="texts">
                  <span>{chat.user?.username || "Unknown User"}</span>
                  <p>{chat.lastMessage || "No messages yet..."}</p>
                </div>
              </div>
              <button
                className="deleteBtn"
                onClick={() => handleDeleteChat(chat)}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
