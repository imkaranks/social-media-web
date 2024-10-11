import useAuth from "@/hooks/useAuth";
import useCreatePost from "@/hooks/useCreatePost";
import Button from "@/components/ui/Button";

export default function CreatePost() {
  const { auth } = useAuth();
  const { setIsPostModalOpen } = useCreatePost();

  return (
    <div
      onClick={() => setIsPostModalOpen(true)}
      className="mt-4 flex items-center justify-between rounded-xl bg-gray-200 px-4 py-2 dark:bg-neutral-700"
    >
      {auth?.user?.avatar?.url ? (
        <img
          className="inline-block size-8 rounded-full object-cover max-[27.25em]:hidden sm:size-9 md:size-10"
          src={auth.user.avatar.url}
          alt={auth?.user?.fullname}
        />
      ) : (
        <span className="inline-flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold leading-none text-gray-800 dark:bg-white/10 dark:text-white max-[27.25em]:hidden">
          {auth?.user?.fullname.split(" ").map((word) => word[0].toUpperCase())}
        </span>
      )}
      <input
        type="text"
        placeholder={`What's on your mind, ${auth?.user?.fullname?.split(" ")[0]}?`}
        id="create-post"
        className="flex w-full justify-self-start truncate bg-transparent text-sm outline-none min-[27.25em]:pl-4"
      />
      <Button className="p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5 sm:size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
          />
        </svg>
        <span className="sr-only">Post</span>
      </Button>
    </div>
  );
}
