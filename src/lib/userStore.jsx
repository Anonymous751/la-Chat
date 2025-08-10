import { doc, getDoc } from "firebase/firestore";
import { db, rtdb } from "./Firebase";
import { ref, get, onValue } from "firebase/database";
import { create } from "zustand";

export const useUserStore = create((set) => ({
  currentUser: null,
  photos: [],
  isLoading: true,

  fetchUserInfo: async (uid) => {
    if (!uid) return set({ currentUser: null, photos: [], isLoading: false });

    try {
      // Fetch user info from Firestore
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      const userData = docSnap.exists() ? docSnap.data() : {};

      // Fetch avatar from Realtime DB
      const avatarRef = ref(rtdb, `avatars/${uid}/avatar`);
      const avatarSnap = await get(avatarRef);
      const avatar = avatarSnap.exists() ? avatarSnap.val() : "./avatar.png";

      set({
        currentUser: {
          ...userData,
          avatar,
          uid,
        },
        isLoading: false,
      });

      // Subscribe to photos in Realtime DB (live updates)
      const photosRef = ref(rtdb, `photos/${uid}`);
      onValue(photosRef, (snapshot) => {
        const val = snapshot.val();
        set({ photos: val ? Object.values(val) : [] });
      });
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      set({ currentUser: null, photos: [], isLoading: false });
    }
  },
}));
