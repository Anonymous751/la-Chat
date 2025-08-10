import React, { useState } from "react";
import "./login.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db, rtdb } from "../../lib/Firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, set } from "firebase/database";
import { toast } from "react-toastify";

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  // Convert image to Base64
  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar({
        file,
        url: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  // Register (Sign Up)
  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    if (!username || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Save to Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      // Save avatar in Realtime DB
      await set(ref(rtdb, `avatars/${res.user.uid}`), {
        avatar: avatar.url || "",
      });

      toast.success("Account Created! Please log in to continue.");

      // Immediately sign out so it doesn’t redirect to chat
      await signOut(auth);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formdata = new FormData(e.target);
    const { email, password } = Object.fromEntries(formdata);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (onLogin) onLogin(true); // pass a flag so parent knows this was a manual login
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      {/* Login Form */}
      <div className="item">
        <h2>Welcome back,</h2>
        <form onSubmit={handleLogin}>
          <input type="text" name="email" placeholder="Email" />
          <input type="password" name="password" placeholder="Password" />
          <button disabled={loading}>{loading ? "Loading..." : "Login"}</button>
        </form>
      </div>

      <div className="separator"></div>

      {/* Register Form */}
      <div className="item">
        <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="Upload Preview" />
            Upload an image
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="text" name="username" placeholder="Username" />
          <input type="text" name="email" placeholder="Email" />
          <input type="password" name="password" placeholder="Password" />
          <button>Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
