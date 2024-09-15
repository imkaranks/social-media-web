import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
// import useStore from "@/app/store";

export default function Search() {
  const axiosPrivate = useAxiosPrivate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query");

  // const users = useStore((state) => state.search.users);
  // const posts = useStore((state) => state.search.posts);

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);

  const showTabpanelWithIdx = (idx) => {
    if (idx !== currentTab) {
      setCurrentTab(idx);
    }
  };

  useEffect(() => {
    const getResults = async () => {
      const results = await Promise.all([
        axiosPrivate.get(`user/search/?keyword=${query}`),
        axiosPrivate.get(`post/search/?keyword=${query}`),
      ]);

      const users = results[0]?.data?.data;
      const posts = results[1]?.data?.data;

      setUsers(users);
      setPosts(posts);
    };

    getResults();
  }, [query, axiosPrivate]);

  return (
    <div className="p-4">
      <nav className="flex flex-wrap gap-4" aria-label="Tabs" role="tablist">
        {[{ title: "Users" }, { title: "Posts" }].map((tab, idx) => (
          <button
            key={idx}
            type="button"
            className={`${idx === currentTab ? "bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-white " : "text-gray-700 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 "}max-md:flex-1 flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 max-2xl:text-sm max-xl:p-2 max-md:justify-center`}
            id={`setting-tab-item-${idx + 1}`}
            aria-controls={`setting-tab-${idx + 1}`}
            role="tab"
            onClick={() => showTabpanelWithIdx(idx)}
          >
            {tab.title}
          </button>
        ))}
      </nav>
      <div>
        {currentTab === 0 && (
          <div
            className="divide-y-[1px] divide-gray-200 dark:divide-neutral-700"
            key={currentTab}
            id={`setting-tab-${currentTab + 1}`}
            // className={currentTab !== currentTab ? "hidden" : ""}
            role="tabpanel"
            aria-labelledby={`setting-tab-item-${currentTab + 1}`}
          >
            {users?.length > 0 &&
              users.map((user, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4">
                  <div className="relative inline-block">
                    <Avatar size="xsmall" user={user} />
                  </div>

                  <div className="flex-1">
                    <h4 className="max-2xl:text-sm">{user?.username}</h4>
                    {user?.bio && (
                      <p className="text-xs opacity-35 2xl:text-sm">
                        {user.bio.length > 100
                          ? `${user.bio.slice(0, 100)}...`
                          : user.bio}
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
        {currentTab === 1 && (
          <div
            className="divide-y-[1px] divide-gray-200 dark:divide-neutral-700"
            key={currentTab}
            id={`setting-tab-${currentTab + 1}`}
            role="tabpanel"
            aria-labelledby={`setting-tab-item-${currentTab + 1}`}
          >
            {posts?.length > 0 &&
              posts.map((post, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-5" user={post?.author} />
                      <span>{post?.author?.username}</span>
                    </div>
                    <h3>{post?.title}</h3>
                    <div>
                      <Button variant="ghost" size="small">
                        {post?.userLikedPost ? "Unlike" : "Like"}{" "}
                        {post?.likeCount || 0}
                      </Button>
                      <Button variant="ghost" size="small">
                        Comment {post?.commentCount || 0}
                      </Button>
                    </div>
                  </div>
                  <img
                    src={post?.images[0]?.url}
                    alt=""
                    className="w-full max-w-40 object-cover object-center"
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
