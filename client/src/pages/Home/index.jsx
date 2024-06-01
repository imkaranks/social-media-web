import CreatePost from "./CreatePost";
import Feed from "./Feed";
import Stories from "./Stories";

export default function Home() {
  return (
    <div className="overflow-x-hidden max-md:w-[calc(100%-1rem)]">
      <Stories />
      <CreatePost />
      <Feed />
    </div>
  );
}
