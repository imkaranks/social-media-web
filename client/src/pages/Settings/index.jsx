import { useState } from "react";
import Accounts from "./Accounts";
import Security from "./Security";
import Notifications from "./Notifications";
import Appearance from "./Appearance";

const tabs = [
  {
    title: "Accounts",
    Component: Accounts,
  },
  {
    title: "Security",
    Component: Security,
  },
  {
    title: "Notifications",
    Component: Notifications,
  },
  {
    title: "Appearance",
    Component: Appearance,
  },
];

export default function Settings() {
  const [currentTab, setCurrentTab] = useState(0);

  const showTabpanelWithIdx = (idx) => {
    if (idx !== currentTab) {
      setCurrentTab(idx);
    }
  };

  return (
    <div className="md:flex md:h-[calc(100vh-4.5625rem)] md:flex-wrap">
      <div className="border-b border-gray-200 p-4 dark:border-neutral-700 md:w-[15rem] md:border-r">
        <nav
          className="flex flex-wrap md:flex-col md:space-y-2"
          aria-label="Tabs"
          role="tablist"
        >
          {tabs.map((tab, idx) => (
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
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:h-full">
        {tabs.map(({ Component }, idx) => (
          <div
            key={idx}
            id={`setting-tab-${idx + 1}`}
            className={currentTab !== idx ? "hidden" : ""}
            role="tabpanel"
            aria-labelledby={`setting-tab-item-${idx + 1}`}
          >
            <Component />
          </div>
        ))}
      </div>
    </div>
  );
}
