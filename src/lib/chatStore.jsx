
import { create } from "zustand";

export const useChatStore = create((set) => ({
  user: null,
  chatId: null,

  selectUser: (currentUserId, selectedUser) => {
    const chatId =
      currentUserId > selectedUser.id
        ? `${currentUserId}_${selectedUser.id}`
        : `${selectedUser.id}_${currentUserId}`;

    set({ user: selectedUser, chatId });
  },

  clearChat: () => set({ user: null, chatId: null }),
}));
