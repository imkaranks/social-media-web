import { create } from "zustand";

const useStore = create((set) => ({
  posts: [],
  lastChats: {},
  chats: {},
  unreadChats: 0,
  unreadFriendChats: {},
  friends: [],
  pendingFriendRequests: [],
  setPosts: (newPosts) => set(() => ({ posts: newPosts })),
  addPost: (newPost) => set((state) => ({ posts: [newPost, ...state.posts] })),
  addMorePosts: (newPosts) =>
    set((state) => ({ posts: [...state.posts, ...newPosts] })),
  removePost: (postId) =>
    set((state) => ({
      posts: state.posts.filter((post) => post._id !== postId),
    })),
  setFriends: (newFriends) => set(() => ({ friends: newFriends })),
  addFriend: (newFriend) =>
    set((state) => ({ friends: [...state.friends, newFriend] })),
  setPendingFriendRequests: (newPendingFriendRequests) =>
    set(() => ({ pendingFriendRequests: newPendingFriendRequests })),
  acceptPendingFriendRequest: (pendingFriendRequestId) =>
    set((state) => {
      const newFriend = state.pendingFriendRequests.received.find(
        (pendingFriendRequest) =>
          pendingFriendRequest._id === pendingFriendRequestId,
      );
      state.addFriend(newFriend?.sender);
      return {
        pendingFriendRequests: state.pendingFriendRequests.received.filter(
          (pendingFriendRequest) =>
            pendingFriendRequest._id !== pendingFriendRequestId,
        ),
      };
    }),
  rejectPendingFriendRequest: (pendingFriendRequestId) =>
    set((state) => ({
      pendingFriendRequests: state.pendingFriendRequests.received.filter(
        (pendingFriendRequest) =>
          pendingFriendRequest._id !== pendingFriendRequestId,
      ),
    })),
  setChats: (payload) => set(() => ({ chats: payload })),
  setFriendChat: (payload) =>
    set((state) => {
      // console.log(payload);
      return {
        chats: {
          ...state.chats,
          [payload.username]: payload.chats,
        },
      };
    }),
  addFriendChat: (payload) =>
    set((state) => {
      // console.log(state.chats);
      return {
        chats: {
          ...state.chats,
          [payload.username]: state.chats[payload.username]
            ? [...state.chats[payload.username], payload.chat]
            : [payload.chat],
        },
      };
    }),
  initUnreadFriendChats: (users) =>
    set(() => users.reduce((acc, user) => ({ ...acc, [user]: 0 }), {})),
  addUnreadFriendChat: (username) =>
    set((state) => ({
      unreadFriendChats: {
        ...state.unreadFriendChats,
        [username]: state.unreadFriendChats[username] + 1 || 1,
      },
    })),
  markFriendChatAsRead: (username) =>
    set((state) => ({
      unreadFriendChats: { ...state.unreadFriendChats, [username]: 0 },
    })),
}));

export default useStore;
