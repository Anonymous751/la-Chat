import { useEffect, useState } from "react";
import { auth, db, rtdb } from "../../lib/Firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { ref as rtdbRef, push } from "firebase/database";
import { toast } from "react-toastify";
import { useUserStore } from "../../lib/userStore";
import "./detail.css";

const Detail = ({ chatUser }) => {
  const { currentUser, photos, isLoading, fetchUserInfo } = useUserStore();
  const [uploading, setUploading] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [blockedList, setBlockedList] = useState([]);

  // Load logged-in user info on mount
  useEffect(() => {
    if (!currentUser?.uid) {
      const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          fetchUserInfo(firebaseUser.uid);
          // Also fetch blocked list
          fetchBlockedList(firebaseUser.uid);
        }
      });
      return () => unsubscribe();
    } else {
      fetchBlockedList(currentUser.uid);
    }
  }, [currentUser, fetchUserInfo]);

  // Fetch blocked list from Firestore
  const fetchBlockedList = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        setBlockedList(data.blocked || []);
      } else {
        setBlockedList([]);
      }
    } catch (error) {
      console.error("Failed to fetch blocked list:", error);
    }
  };

  const handlePhotoUpload = (e) => {
    if (!currentUser) {
      toast.error("Please log in first");
      return;
    }
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result;
      try {
        const photosRef = rtdbRef(rtdb, `photos/${currentUser.uid}`);
        await push(photosRef, base64String);
        toast.success("Photo uploaded successfully!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload photo. Try again.");
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleBlockUser = async () => {
    if (!currentUser || !chatUser) {
      toast.error("No user selected to block.");
      return;
    }
    setBlocking(true);
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        blocked: arrayUnion(chatUser.uid),
      });
      toast.success(`Blocked user ${chatUser.displayName || chatUser.uid}`);
      setBlockedList((prev) => [...prev, chatUser.uid]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to block user. Try again.");
    }
    setBlocking(false);
  };

  if (isLoading) return <div>Loading user details...</div>;

  if (!currentUser) {
    return (
      <div className="detail">
        <p>Please log in to see your details.</p>
      </div>
    );
  }

  const isBlocked = chatUser && blockedList.includes(chatUser.uid);

  return (
    <div className="detail">
      <div className="user">
        <img src={currentUser.avatar || "./avatar.png"} alt="User avatar" />
        <h2>{currentUser.displayName || currentUser.username || "User"}</h2>
        <p>{currentUser.email || ""}</p>

        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          disabled={uploading}
        />
        {uploading && <p>Uploading photo...</p>}
      </div>

      <div className="info">
        <div className="option">
          <div className="title">
            <span>Photos</span>
          </div>
          <div className="photos">
            {photos.length === 0 ? (
              <p>No photos available.</p>
            ) : (
              photos.map((base64, idx) => (
                <div key={idx} className="photoItem">
                  <div className="photoDetail">
                    <img src={base64} alt={`Photo ${idx + 1}`} />
                    <span>{`Photo_${idx + 1}`}</span>
                  </div>
                  <img
                    src="./download.png"
                    alt="Download icon"
                    className="icon"
                    onClick={() => {
                      const win = window.open();
                      if (win) {
                        win.document.write(
                          `<img src="${base64}" alt="download" />`
                        );
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared files</span>
            <img src="./arrowDown.png" alt="Toggle shared files" />
          </div>
        </div>

        {chatUser && (
          <button disabled={blocking || isBlocked} onClick={handleBlockUser}>
            {blocking
              ? "Blocking..."
              : isBlocked
              ? "User Blocked"
              : "Block User"}
          </button>
        )}

        <button className="logout" onClick={() => auth.signOut()}>
          Logout
        </button>
      </div>

      {isBlocked && (
        <div
          style={{ marginTop: "1rem", color: "red", fontWeight: "bold" }}
        >
          You have blocked this user. Chat options are disabled.
        </div>
      )}
    </div>
  );
};

export default Detail;
