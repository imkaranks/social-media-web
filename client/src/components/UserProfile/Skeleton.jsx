import { MutualFriendsSkeleton } from "./MutualFriends";
import { ProfileBannerSkeleton } from "@/components/ui/ProfileBanner";
import { UserInfoSkeleton } from "@/components/ui/UserInfo";
import { FriendRequestControlsSkeleton } from "./FriendRequestControls";

export default function Skeleton({ isAuthUser }) {
  return (
    <div className="p-4 md:pr-0">
      <ProfileBannerSkeleton />

      <div className="mt-14 px-4">
        <UserInfoSkeleton />

        {!isAuthUser && <FriendRequestControlsSkeleton />}

        <MutualFriendsSkeleton />
      </div>
    </div>
  );
}
