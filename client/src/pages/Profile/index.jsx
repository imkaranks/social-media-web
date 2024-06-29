import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useFriend from "@/hooks/useFriend";
import Posts from "./Posts";
import Comments from "./Comments";
import Media from "./Media";
import Likes from "./Likes";

const tabs = [
  {
    title: "Posts",
    Component: Posts,
  },
  {
    title: "Comments",
    Component: Comments,
  },
  {
    title: "Likes",
    Component: Likes,
  },
  {
    title: "Media",
    Component: Media,
  },
];

export default function Profile() {
  const { auth } = useAuth();
  const { username } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const { friends, friendsLoading } = useFriend();
  const [currentTab, setCurrentTab] = useState(0);
  const [user, setUser] = useState({});
  const [userLoading, setUserLoading] = useState(false);
  const [sendRequestSubmitting, setSendRequestSubmitting] = useState(false);
  // const [rejectRequestSubmitting, setRejectRequestSubmitting] = useState(false);

  const alreadyFriend =
    !!friends.length && friends.find((friend) => friend._id === user?._id);

  const showTabpanelWithIdx = (idx) => {
    if (idx !== currentTab) {
      setCurrentTab(idx);
    }
  };

  const sendFriendRequest = async (recipientId) => {
    if (recipientId === auth?.user?._id) return;

    setSendRequestSubmitting(true);

    try {
      await axiosPrivate.post("/friend/send", {
        senderId: auth?.user?._id,
        recipientId,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setSendRequestSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setUserLoading(true);
      try {
        const response = await axiosPrivate.get(`/user/u/${username}`);
        setUser(response?.data?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, [axiosPrivate, username]);

  return (
    <div className="p-4 md:pr-0">
      <div
        className="relative min-h-48 bg-gray-200 bg-[image:var(--bg-image)] bg-cover bg-center bg-no-repeat dark:bg-neutral-700"
        style={{
          "--bg-image":
            "url(https://images.unsplash.com/photo-1636955840493-f43a02bfa064?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        }}
      >
        {user?.avatar?.url ? (
          <img
            className="absolute bottom-0 left-4 inline-block size-24 flex-shrink-0 translate-y-1/2 rounded-full border-4 border-white bg-gray-200 object-cover dark:border-neutral-800 dark:bg-neutral-700"
            src={user.avatar.url}
            alt={user?.fullname}
          />
        ) : (
          <span className="absolute bottom-0 left-4 inline-flex size-24 flex-shrink-0 translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-gray-100 text-2xl font-semibold leading-none text-gray-800 dark:border-neutral-800 dark:bg-neutral-700 dark:text-white">
            {user?.fullname?.split(" ").map((word) => word[0].toUpperCase())}
          </span>
        )}
      </div>

      <div className="mt-14 px-4">
        <h3 className="font-semibold text-gray-800 dark:text-white">
          {user?.fullname}
        </h3>
        <p className="text-sm font-medium text-gray-400 dark:text-neutral-500">
          {user?.email}
        </p>
        {user?.bio && <p className="mt-4">{auth.user.bio}</p>}

        {user?.location && (
          <div className="mt-2 flex items-center gap-1 text-sm text-gray-400 dark:text-neutral-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>

            {user.location && <span>{user.location}</span>}
          </div>
        )}

        {!userLoading &&
          !friendsLoading &&
          user?._id !== auth?.user?._id &&
          (alreadyFriend ? (
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <button className="inline-flex items-center rounded-lg border border-transparent bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-50 dark:bg-white/10 dark:text-neutral-400 dark:hover:bg-white/20 dark:hover:text-neutral-300">
                Unfriend
              </button>
            </div>
          ) : (
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <button
                disabled={sendRequestSubmitting}
                className="inline-flex items-center rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
                onClick={() => sendFriendRequest(user._id)}
              >
                Add Friend
              </button>
            </div>
          ))}

        <div className="mt-2 flex flex-wrap items-center gap-4">
          <p>
            <strong>1K</strong>{" "}
            <span className="text-gray-400 dark:text-neutral-500">
              following
            </span>
          </p>
          <p>
            <strong>1K</strong>{" "}
            <span className="text-gray-400 dark:text-neutral-500">
              followers
            </span>
          </p>
        </div>

        <div className="mt-2 flex gap-2 max-sm:flex-col sm:items-center">
          <div className="flex items-center -space-x-2">
            {!!friends.length &&
              (friends.length > 3 ? friends.slice(0, 3) : friends).map(
                (friend, idx) => (
                  <img
                    key={idx}
                    className="inline-block size-6 rounded-full ring-2 ring-gray-100 dark:ring-neutral-700/20"
                    src={friend?.avatar?.url}
                    alt={friend?.fullname}
                  />
                ),
              )}
          </div>
          <p className="text-xs text-gray-400 dark:text-neutral-500 sm:text-sm">
            followed by <strong>Ernest Becker</strong> and 69 others you follow
          </p>
        </div>

        <div className="mt-4 border-b border-gray-200 dark:border-neutral-700">
          <nav
            className="-mb-0.5 flex justify-around"
            aria-label="Tabs"
            role="tablist"
          >
            {tabs.map((tab, idx) => (
              <button
                key={idx}
                type="button"
                className={`${idx === currentTab ? "border-blue-600 font-semibold text-blue-600 " : "border-transparent text-gray-500 "}inline-flex items-center gap-x-2 whitespace-nowrap border-b-2 px-1 py-4 text-xs hover:text-blue-600 focus:text-blue-600 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-400 dark:hover:text-blue-500 sm:text-sm`}
                id={`profile-tab-item-${idx + 1}`}
                aria-controls={`profile-tab-${idx + 1}`}
                onClick={() => showTabpanelWithIdx(idx)}
                role="tab"
              >
                {tab.title}
              </button>
            ))}
          </nav>
        </div>

        <div className="mx-auto mt-8 space-y-4 lg:w-[90%]">
          {tabs.map(({ Component }, idx) => (
            <div
              key={idx}
              id={`profile-tab-${idx + 1}`}
              className={currentTab !== idx ? "hidden" : ""}
              role="tabpanel"
              aria-labelledby={`profile-tab-item-${idx + 1}`}
            >
              <Component />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
