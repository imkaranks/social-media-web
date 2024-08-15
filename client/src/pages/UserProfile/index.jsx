import { useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useFriendshipHandler from "@/hooks/useFriendshipHandler";
import useUserInformation from "@/hooks/useUserInformation";
import useUserFriends from "@/hooks/useUserFriends";
import Tabs from "@/components/UserProfile/Tabs";
import MutualFriends from "@/components/UserProfile/MutualFriends";
import ProfileBanner from "@/components/ui/ProfileBanner";
import UserInfo from "@/components/ui/UserInfo";
import FriendRequestControls from "@/components/UserProfile/FriendRequestControls";
import Skeleton from "@/components/UserProfile/Skeleton";

export default function Profile() {
  const { userId } = useParams();
  const { auth } = useAuth();
  const {
    user,
    isLoading: userLoading,
    error: userError,
  } = useUserInformation({ id: userId });
  const {
    mutualFriends,
    isLoading: friendsLoading,
    error: friendsError,
  } = useUserFriends({
    id: userId,
  });
  const {
    isSubmitting,
    acceptRequest,
    rejectRequest,
    isExistingFriend,
    didSentRequest,
    didReceivedRequest,
    sendFriendRequest,
    sendingFriendRequest,
  } = useFriendshipHandler();

  const alreadyFriend = isExistingFriend(user?._id);
  const receivedRequest = didReceivedRequest(user?._id);

  return userLoading || friendsLoading ? (
    <Skeleton isSignedInUser={user?._id === auth?.user?._id} />
  ) : !userError && !friendsError ? (
    <div className="p-4 md:pr-0">
      <ProfileBanner
        avatar={user?.avatar?.url}
        name={user?.fullname}
        banner={user?.banner?.url}
      />

      <div className="mt-14 px-4">
        <UserInfo user={user} />

        {user?._id !== auth?.user?._id && (
          <FriendRequestControls
            userId={user?._id}
            alreadyFriend={alreadyFriend}
            receivedRequest={receivedRequest}
            isSubmitting={isSubmitting}
            acceptRequest={acceptRequest}
            rejectRequest={rejectRequest}
            didSentRequest={didSentRequest}
            sendingFriendRequest={sendingFriendRequest}
            sendFriendRequest={sendFriendRequest}
          />
        )}

        {mutualFriends.length > 0 && (
          <MutualFriends mutualFriends={mutualFriends} />
        )}

        <Tabs username={user?.username} />
      </div>
    </div>
  ) : (
    <p>
      {userError} and {friendsError}
    </p>
  );
}
