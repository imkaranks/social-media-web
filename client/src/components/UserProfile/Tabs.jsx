import Posts from "./Posts";
import Comments from "./Comments";
import Media from "./Media";
import Likes from "./Likes";
import { useState } from "react";

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

export default function Tabs({ username }) {
  const [currentTab, setCurrentTab] = useState(0);

  const showActiveTabpanel = (idx) => {
    if (idx !== currentTab) {
      setCurrentTab(idx);
    }
  };

  return (
    <>
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
              onClick={() => showActiveTabpanel(idx)}
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
            <Component username={username} />
          </div>
        ))}
      </div>
    </>
  );
}
