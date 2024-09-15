import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Accounts from "@/components/Settings/Accounts";
import Security from "./Security";
import Notifications from "./Notifications";
import Appearance from "./Appearance";

const tabs = [
  { title: "Accounts", key: "accounts", Component: Accounts },
  { title: "Security", key: "security", Component: Security },
  { title: "Notifications", key: "notifications", Component: Notifications },
  { title: "Appearance", key: "appearance", Component: Appearance },
];

export default function Settings() {
  const location = useLocation();
  // const history = useHistory()
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState("accounts");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setCurrentTab(tabParam);
    }
  }, [location.search]);

  const showTabpanelWithKey = (key) => {
    setCurrentTab(key);
    setSearchParams(new URLSearchParams({ tab: key }));
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
              className={`${
                currentTab === tab.key
                  ? "bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-white"
                  : "text-gray-700 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
              } flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 max-2xl:text-sm max-xl:p-2 max-md:flex-1 max-md:justify-center`}
              id={`setting-tab-item-${tab.key}`}
              aria-controls={`setting-tab-${tab.key}`}
              role="tab"
              onClick={() => showTabpanelWithKey(tab.key)}
            >
              {tab.title}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:h-full">
        {tabs.map(({ Component, key }) => (
          <div
            key={key}
            id={`setting-tab-${key}`}
            className={currentTab !== key ? "hidden" : ""}
            role="tabpanel"
            aria-labelledby={`setting-tab-item-${key}`}
          >
            <Component />
          </div>
        ))}
      </div>
    </div>
  );
}
