import { MutualFriendsSkeleton } from "./MutualFriends";
import { ProfileBannerSkeleton } from "@/components/ui/ProfileBanner";
import { UserInfoSkeleton } from "@/components/ui/UserInfo";
import { FriendRequestControlsSkeleton } from "./FriendRequestControls";
import { TabsSkeleton } from "./Tabs";

export default function Skeleton({ isSignedInUser }) {
  return (
    <div className="p-4 md:pr-0">
      {/* <div className="absolute left-4 top-4 h-[calc(100%-1rem)] w-[calc(100%-1rem)]"> */}
      <ProfileBannerSkeleton />

      <div className="mt-14 px-4">
        <UserInfoSkeleton />

        {!isSignedInUser && <FriendRequestControlsSkeleton />}

        {!isSignedInUser && <MutualFriendsSkeleton />}

        <TabsSkeleton />
      </div>
    </div>
  );
}
