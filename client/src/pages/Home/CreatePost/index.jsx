import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import useCreatePost from "@/hooks/useCreatePost";

const INITIAL_DATA = {
  title: "",
  content: "",
};

export default function CreatePost() {
  const { auth } = useAuth();
  const { createPost, isSubmitting } = useCreatePost();
  const [data, setData] = useState(INITIAL_DATA);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
    const previews = [];
    for (let i = 0; i < event.target.files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target.result);
        if (previews.length === event.target.files.length) {
          setFilePreviews(previews);
        }
      };
      reader.readAsDataURL(event.target.files[i]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await createPost(data, selectedFiles);

      setData(INITIAL_DATA);
      setIsOpen(false);
      setSelectedFiles([]);
      setFilePreviews([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : error);
    }
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="mt-4 flex items-center justify-between rounded-xl bg-gray-200 px-4 py-2 dark:bg-neutral-700"
      >
        {auth?.user?.avatar?.url ? (
          <img
            className="inline-block size-8 rounded-full object-cover sm:size-9 md:size-10"
            src={auth.user.avatar.url}
            alt={auth?.user?.fullname}
          />
        ) : (
          <span className="inline-flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold leading-none text-gray-800 dark:bg-white/10 dark:text-white">
            {auth?.user?.fullname
              .split(" ")
              .map((word) => word[0].toUpperCase())}
          </span>
        )}
        <input
          type="text"
          placeholder={`What's on your mind, ${auth?.user?.fullname?.split(" ")[0]}?`}
          id="create-post"
          className="flex w-full justify-self-start bg-transparent pl-4 outline-none"
        />
        <button className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 p-2 text-center text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50">
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
        </button>
      </div>

      {/* main modal */}
      <div className="pointer-events-none fixed start-0 top-0 z-[80] size-full overflow-y-auto overflow-x-hidden">
        <div
          className={`${isOpen ? "pointer-events-auto mt-7 opacity-100 " : "pointer-events-none mt-0 opacity-0 "}m-3 transition-all duration-300 ease-out md:mx-auto md:w-full md:max-w-2xl`}
        >
          <div className="flex flex-col rounded-xl border bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-neutral-700/70">
            <div className="flex items-center justify-between border-b px-4 py-3 dark:border-neutral-700">
              <h3 className="font-bold text-gray-800 dark:text-white">
                Create new post
              </h3>
              <button
                type="button"
                className="flex size-7 items-center justify-center rounded-full border border-transparent text-sm font-semibold text-gray-800 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-neutral-700"
                onClick={() => setIsOpen(false)}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="size-4 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2 overflow-y-auto p-4">
              {/* Avatar */}
              <div className="flex items-start gap-2 max-sm:flex-col md:gap-4">
                {auth?.user?.avatar?.url ? (
                  <img
                    className="inline-block size-8 rounded-full object-cover sm:size-9 md:size-10"
                    src={auth.user.avatar.url}
                    alt="Me"
                  />
                ) : (
                  <span className="inline-flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold leading-none text-gray-800 dark:bg-white/10 dark:text-white">
                    {auth?.user?.fullname
                      .split(" ")
                      .map((word) => word[0].toUpperCase())}
                  </span>
                )}
                <div className="leading-tight">
                  <p>{auth?.user?.username}</p>
                  <span className="rounded bg-gray-200 px-1 py-0.5 text-xs dark:bg-neutral-700">
                    Public
                  </span>
                </div>
              </div>

              <div className="max-lg:text-sm">
                <input
                  type="text"
                  name="title"
                  placeholder={`What's on your mind, ${auth?.user?.fullname?.split(" ")[0]}?`}
                  className="flex w-full justify-self-start bg-transparent py-1 outline-none"
                  value={data.title}
                  onChange={handleInputChange}
                />

                <textarea
                  className="flex w-full resize-none justify-self-start bg-transparent py-1 outline-none"
                  name="content"
                  rows={2}
                  placeholder={`Share your thoughts. Feel free to express yourself here.`}
                  value={data.content}
                  onChange={handleInputChange}
                />
              </div>

              {!!filePreviews.length && (
                <div className="grid grid-cols-2 gap-4">
                  {filePreviews.map((filePreview, idx) => (
                    <img key={idx} src={filePreview} />
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between border-t px-4 py-3 dark:border-neutral-700">
              <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                Add to your post
              </h3>
              <div className="relative">
                <input
                  type="file"
                  name="images"
                  id="images"
                  multiple
                  accept="image/*"
                  className="peer absolute inset-0 opacity-0 outline-none"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="images"
                  className="inline-flex cursor-pointer items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 p-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 peer-focus:outline"
                >
                  <span className="sr-only">Choose images</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </label>
                {!!selectedFiles.length && (
                  <span className="absolute right-0 top-0 grid size-[3ch] -translate-y-1/3 translate-x-1/3 place-items-center rounded-full bg-black text-xs text-white">
                    {selectedFiles.length}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-2 border-t px-4 py-3 dark:border-neutral-700">
              <button
                type="button"
                className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                data-hs-overlay="#hs-medium-modal"
              >
                Close
              </button>
              <button
                disabled={isSubmitting}
                type="button"
                className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
                onClick={handleSubmit}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </>
  );
}
