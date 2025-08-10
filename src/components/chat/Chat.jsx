// src/components/chat/Chat.jsx
import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  Timestamp,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../lib/Firebase";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const endRef = useRef(null);

  const { user, chatId } = useChatStore();
  const { currentUser } = useUserStore();

  // Auto-scroll on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages in real-time for selected chat
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    const unsub = onSnapshot(doc(db, "chats", chatId), (docSnap) => {
      setMessages(docSnap.exists() ? docSnap.data().messages || [] : []);
    });

    return () => unsub();
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleSend = async () => {
    if (!text.trim() || !chatId) return;

    try {
      const chatRef = doc(db, "chats", chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        // Create chat document if it doesn't exist
        await setDoc(chatRef, { messages: [] });
      }

      await updateDoc(chatRef, {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: Timestamp.now(),
        }),
      });

      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally show error to user via toast or UI
    }
  };

  if (!user) {
    return (
      <div className="chat empty">
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="chat">
      {/* Top */}
      <div className="top">
        <div className="user">
          <img src={user.avatar || "./avatar.png"} alt="avatar" />
          <div className="texts">
            <span>{user.username}</span>
            <p>{user.bio || "Hey there! I'm using ChatApp"}</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="call" />
          <img src="./video.png" alt="video" />
          <img src="./info.png" alt="info" />
        </div>
      </div>

      {/* Middle */}
      <div className="center">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`messages ${
              msg.senderId === currentUser.id ? "own" : ""
            }`}
          >
            <img
              src={
                msg.senderId === currentUser.id
                  ? currentUser.avatar || "./avatar.png"
                  : user.avatar || "./avatar.png"
              }
              alt="avatar"
            />
            <div className="texts">
              <p>{msg.text}</p>
              <span>
                {msg.createdAt
                  ? msg.createdAt.toDate().toLocaleString()
                  : "Just now"}
              </span>
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>

      {/* Bottom */}
      <div className="bottom">
        <div className="icons">
          <img src="./img.png" alt="img" />
          <img src="./camera.png" alt="camera" />
          <img src="./mic.png" alt="mic" />
        </div>
        <input
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <div className="emoji">
          <img
            src="./emoji.png"
            alt="emoji"
            onClick={() => setOpen((prev) => !prev)}
          />
          {open && (
            <div className="picker">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>
        <button className="sendButton" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
