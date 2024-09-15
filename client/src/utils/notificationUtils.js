export const generateNotificationMessage = (notification) => {
  if (!notification) {
    return "Notification details are missing.";
  }

  const {
    type,
    user,
    relatedPost,
    relatedLike,
    relatedComment,
    relatedFriend,
  } = notification;

  if (!user || !type) {
    return "Notification details are missing.";
  }

  const userName = user.username || user.fullname || "User";

  switch (type.toUpperCase()) {
    case "POST": {
      const postAuthor =
        relatedPost && relatedPost.author
          ? relatedPost.author.username
          : "someone";
      return `${postAuthor} has posted a new update.`;
    }

    case "LIKE":
      return `${userName} liked your post.`;

    case "COMMENT": {
      const commentAuthor =
        relatedComment && relatedComment.user
          ? relatedComment.user.username
          : "someone";
      return `${commentAuthor} commented on your post.`;
    }

    case "REPLY": {
      const replyAuthor =
        relatedComment && relatedComment.user
          ? relatedComment.user.username
          : "someone";
      return `${replyAuthor} replied to your comment.`;
    }

    case "FRIEND_REQUEST_SENT": {
      const friendRequestSender =
        relatedFriend && relatedFriend.user1
          ? relatedFriend.user1.username
          : "someone";
      return `${friendRequestSender} sent you a friend request.`;
    }

    case "FRIEND_REQUEST_ACCEPTED": {
      const friendRequestReciever =
        relatedFriend && relatedFriend.user2
          ? relatedFriend.user2.username
          : "someone";
      return `${friendRequestReciever} accepted your friend request.`;
    }

    default:
      return `${userName} has sent you a notification.`;
  }
};

export const generateNotificationAuthorAvatar = (notification) => {
  if (!notification) {
    return "Notification details are missing.";
  }

  const {
    type,
    user,
    relatedPost,
    relatedLike,
    relatedComment,
    relatedFriend,
  } = notification;

  if (!user || !type) {
    return "Notification details are missing.";
  }

  const defaultUserName = "User";
  const defaultUserAvatar = `https://robohash.org/${defaultUserName}`;

  switch (type.toUpperCase()) {
    case "POST": {
      const postAuthor =
        relatedPost && relatedPost.author
          ? relatedPost.author.fullname
          : "someone";

      const postAuthorAvatar =
        relatedPost && relatedPost.author
          ? relatedPost.author.avatar.url
          : `https://robohash.org/${postAuthor}`;
      return [`${postAuthorAvatar}`, postAuthor];
    }

    case "LIKE": {
      const likeAuthor =
        relatedLike && relatedLike.user ? relatedLike.user.fullname : "someone";

      const likeAuthorAvatar =
        relatedLike && relatedLike.user
          ? relatedLike.user.avatar.url
          : `https://robohash.org/${likeAuthor}`;
      return [`${likeAuthorAvatar}`, likeAuthor];
    }

    case "COMMENT": {
      const commentAuthor =
        relatedComment && relatedComment.user
          ? relatedComment.user.fullname
          : "someone";

      const commentAuthorAvatar =
        relatedComment && relatedComment.user
          ? relatedComment.user.avatar.url
          : `https://robohash.org/${commentAuthor}`;
      return [`${commentAuthorAvatar}`, commentAuthor];
    }

    case "REPLY": {
      const replyAuthor =
        relatedComment && relatedComment.user
          ? relatedComment.user.fullname
          : "someone";

      const replyAuthorAvatar =
        relatedComment && relatedComment.user
          ? relatedComment.user.avatar.url
          : `https://robohash.org/${replyAuthor}`;
      return [`${replyAuthorAvatar}`, replyAuthor];
    }

    case "FRIEND_REQUEST_SENT": {
      const friendRequestSender =
        relatedFriend && relatedFriend.user1
          ? relatedFriend.user1.username
          : "someone";
      const friendRequestSenderAvatar =
        relatedComment && relatedComment.user
          ? relatedComment.user.avatar.url
          : `https://robohash.org/${friendRequestSender}`;
      return [`${friendRequestSenderAvatar}`, defaultUserName];
    }

    case "FRIEND_REQUEST_ACCEPTED": {
      const friendRequestReciever =
        relatedFriend && relatedFriend.user2
          ? relatedFriend.user2.username
          : "someone";
      const friendRequestRecieverAvatar =
        relatedFriend && relatedFriend.user2
          ? relatedFriend.user2.avatar.url
          : `https://robohash.org/${friendRequestReciever}`;
      return [`${friendRequestRecieverAvatar}`, defaultUserName];
    }

    default:
      return [`${defaultUserAvatar}`, defaultUserName];
  }
};

export default generateNotificationMessage;
