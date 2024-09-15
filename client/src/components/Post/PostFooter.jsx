import React from "react";
import useAuth from "@/hooks/useAuth";
import Avatar from "@/components/ui/Avatar";

export default function PostFooter({
  author,
  content,
  likes,
  friendsWhoLiked,
}) {
  const { auth } = useAuth();

  return (
    <>
      {likes?.length > 0 && (
        <div className="mb-1 flex gap-2 max-sm:flex-col sm:items-center">
          <div className="flex items-center -space-x-2">
            {(likes.length > 5 ? likes.slice(0, 5) : likes)
              .filter((likedBy) => likedBy?._id !== auth?.user?._id)
              .map((likedBy, idx) => (
                <Avatar key={idx} className="size-8" user={likedBy} />
              ))}
          </div>
          {friendsWhoLiked?.length > 0 ? (
            <p className="text-xs sm:text-sm">
              Liked by{" "}
              {friendsWhoLiked?.length >= 1 &&
                friendsWhoLiked.map((friendWhoLiked, idx) => (
                  <React.Fragment key={idx}>
                    <strong>{friendWhoLiked.username}</strong>
                    {idx !== friendsWhoLiked?.length - 1
                      ? idx !== friendsWhoLiked.length - 2
                        ? ", "
                        : !(likes.length - friendsWhoLiked?.length)
                          ? " and "
                          : ", "
                      : likes.length - friendsWhoLiked?.length
                        ? " and"
                        : ""}
                  </React.Fragment>
                ))}
              {!!(likes.length - friendsWhoLiked?.length) &&
                ` ${likes.length - friendsWhoLiked.length} others`}
            </p>
          ) : likes?.length ? (
            <p className="text-xs sm:text-sm">
              Liked by {likes?.length} people.
            </p>
          ) : null}
        </div>
      )}

      <div className="mb-1 text-xs sm:text-sm">
        <p>
          <strong>{author?.username}</strong> {content} <span>#lifestyle</span>
        </p>
      </div>
    </>
  );
}
