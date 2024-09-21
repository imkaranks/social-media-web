import { createContext } from "react";
import PostHeader from "./PostHeader";
import PostImages from "./PostImages";
import PostEngagement from "./PostEngagement";
import PostFooter from "./PostFooter";

export const PostContext = createContext(null);

const PostProvider = ({ value, children }) => {
  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export default function Post(props) {
  return (
    <PostProvider value={props}>
      <article className="my-4 rounded-xl bg-gray-100 p-4 text-sm leading-normal dark:bg-neutral-700/20">
        <PostHeader />

        <PostImages />

        <PostEngagement />

        <PostFooter />
      </article>
    </PostProvider>
  );
}
