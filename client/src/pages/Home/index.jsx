import CreatePost from "./CreatePost";
import Feed from "./Feed";
// import Stories from "./Stories";

export default function Home() {
  return (
    <div className="overflow-x-hidden p-4 md:pr-0">
      {/* <Stories /> */}
      <CreatePost />
      <Feed />
    </div>
  );
}
