import { create } from "zustand";

const useStore = create((set) => ({
  posts: [],
  friends: [],
  pendingFriendRequests: [],
  setPosts: (newPosts) => set(() => ({ posts: newPosts })),
  addMorePosts: (newPosts) =>
    set((state) => ({ posts: [...state.posts, ...newPosts] })),
  setFriends: (newFriends) => set(() => ({ friends: newFriends })),
  addFriend: (newFriend) =>
    set((state) => ({ friends: [...state.friends, newFriend] })),
  setPendingFriendRequests: (newPendingFriendRequests) =>
    set(() => ({ pendingFriendRequests: newPendingFriendRequests })),
  acceptPendingFriendRequest: (pendingFriendRequestId) =>
    set((state) => {
      const newFriend = state.pendingFriendRequests.find(
        (pendingFriendRequest) =>
          pendingFriendRequest._id === pendingFriendRequestId,
      );
      state.addFriend(newFriend?.user1);
      return {
        pendingFriendRequests: state.pendingFriendRequests.filter(
          (pendingFriendRequest) =>
            pendingFriendRequest._id !== pendingFriendRequestId,
        ),
      };
    }),
  rejectPendingFriendRequest: (pendingFriendRequestId) =>
    set((state) => ({
      pendingFriendRequests: state.pendingFriendRequests.filter(
        (pendingFriendRequest) =>
          pendingFriendRequest._id !== pendingFriendRequestId,
      ),
    })),
}));

export default useStore;
