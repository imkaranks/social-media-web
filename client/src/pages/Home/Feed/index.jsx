import Post from "@/components/ui/Post";

export default function Feed() {
  return (
    <div className="">
      {new Array(5).fill(0).map((_, idx) => (
        <Post key={idx} />
      ))}
    </div>
  );
}
