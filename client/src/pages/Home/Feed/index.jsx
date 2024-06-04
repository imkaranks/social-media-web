import Post from "@/components/ui/Post";

export default function Feed() {
  return (
    <div className="mx-auto w-[90%]">
      {new Array(5).fill(0).map((_, idx) => (
        <Post key={idx} />
      ))}
    </div>
  );
}
