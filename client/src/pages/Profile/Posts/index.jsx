import Post from "@/components/ui/Post";

export default function Posts() {
  return new Array(5).fill(0).map((_, idx) => <Post key={idx} />);
}
