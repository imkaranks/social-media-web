import { usePostContext } from "./Post.hooks";

export default function PostImages() {
  const { title, images } = usePostContext();

  return images?.length > 0 ? (
    <div className="mt-3 overflow-hidden rounded-xl">
      <img
        src={images[0]?.url}
        className="h-[60vw] max-h-96 w-full object-cover object-center"
        alt={title}
      />
    </div>
  ) : null;
}
