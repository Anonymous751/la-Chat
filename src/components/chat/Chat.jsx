import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";

const Chat = () => {
  const [open, setopen] = useState(false);
  const [text, setText] = useState("")


  const endref = useRef(null)

  useEffect(()=> {
    endref.current?.scrollIntoView({behavior: "smooth"})
  },[]);

  const handleEmoji = (e) => {
    setText((prev)=> prev + e.emoji);
    setopen(false)
  };

  

  return (
    // Wrapper
    <div className="chat">

        {/* Top  */}
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>William</span>
            <p>Lorem ipsum dolor sit amet </p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>

{/* Middle */}
      <div className="center">
   
    <div className="messages ">
        <img src="./avatar.png" alt="" />
        <div className="texts">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id velit soluta iunt necessitatibus eum delectus eaque!</p>
        <span>1 min ago</span>
        </div>
    </div>


     <div className="messages own">
        <img src="./avatar.png" alt="" />
        <div className="texts">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id velit soluta iunt necessitatibus eum delectus eaque!</p>
        <span>1 min ago</span>
        </div>
    </div>

     <div className="messages ">
        <img src="./avatar.png" alt="" />
        <div className="texts">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id velit soluta iunt necessitatibus eum delectus eaque!</p>
        <span>1 min ago</span>
        </div>
    </div>

     <div className="messages own">
        <img src="./avatar.png" alt="" />
        <div className="texts">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id velit soluta iunt necessitatibus eum delectus eaque!</p>
        <span>1 min ago</span>
        </div>
    </div>

     <div className="messages ">
        <img src="./avatar.png" alt="" />
        <div className="texts">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id velit soluta iunt necessitatibus eum delectus eaque!</p>
        <span>1 min ago</span>
        </div>
    </div>

     <div className="messages own">
        <img src="./avatar.png" alt="" />
        <div className="texts">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id velit soluta consectetur. Repellat, eius eum blanditiis necessitatibus vitae veritatis facilis </p>
        <span>1 min ago</span>
        </div>
    </div>

     <div className="messages ">
        <img src="./avatar.png" alt="" />
        <div className="texts">
            <img src="https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg" alt="" />
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id velit soluta  asperiores maiores velit. In sint nesciunt necessitatibus eum delectus eaque!</p>
        <span>1 min ago</span>
        </div>
    </div>
    <div ref={endref}></div>
    
      </div>


{/* Bottom */}
      <div className="bottom">
        <div className="icons">
          <img src="./img.png" alt="" />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input type="text" name="" id="" placeholder="Type your message..." value={text} onChange={e=> setText(e.target.value)} />
        <div className="emoji">
          <img
            src="./emoji.png"
            alt=""
            onClick={() => setopen((prev) => !prev)}
          />
          <div className="picker">
          <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className="sendButton">Send</button>
      </div>
    </div>
  );
};

export default Chat;
