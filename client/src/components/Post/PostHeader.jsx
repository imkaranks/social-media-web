import { useState } from "react";
import { Link } from "react-router-dom";
import { usePostContext } from "./Post.hooks";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";

export default function PostHeader() {
  const { _id, title, isAuthor, author, deletePost } = usePostContext();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [action, setAction] = useState(null);

  const removePost = async () => {
    setIsSubmitting(true);
    try {
      setAction("deletePost");
      await deletePost(_id);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
      setAction(null);
    }
  };

  return (
    <header className="flex w-full items-start gap-4">
      <Link
        to={`/user/${author?._id}`}
        className="flex flex-1 flex-wrap items-start gap-2 md:gap-4"
      >
        <Avatar className="size-9 md:size-10" user={author} />
        <div className="min-w-[min(10rem,_100%)]">
          <p>{author?.username}</p>
          <p>{title}</p>
        </div>
      </Link>

      <div className="relative ml-auto mt-2">
        <Button
          size="small"
          variant="ghost"
          className="aspect-square p-1"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
        </Button>

        <div
          className={`${isOpen ? "mt-0 opacity-100 " : "pointer-events-none mt-2 opacity-0 "}absolute right-0 top-full grid min-w-40 rounded-lg bg-white p-2 shadow-md transition-[opacity,margin] before:absolute before:-top-4 before:start-0 before:h-4 before:w-full after:absolute after:-bottom-4 after:start-0 after:h-4 after:w-full dark:border dark:border-neutral-700 dark:bg-neutral-800`}
        >
          <Button
            size="small"
            variant="ghost"
            disabled={isSubmitting}
            onClick={() => setAction("savePost")}
            className={
              action === "savePost" && isSubmitting ? "animate-pulse" : ""
            }
          >
            {action === "savePost" && isSubmitting ? (
              <>
                <span
                  className="inline-block size-5 animate-spin rounded-full border-[3px] border-white border-t-transparent text-blue-600"
                  role="status"
                  aria-labelledby="save-label"
                ></span>
                <span id="save-label">Saving</span>
              </>
            ) : (
              "Save"
            )}
          </Button>
          {isAuthor && deletePost && (
            <>
              <Button
                size="small"
                variant="ghost"
                disabled={isSubmitting}
                onClick={() => setAction("editPost")}
                className={
                  action === "editPost" && isSubmitting ? "animate-pulse" : ""
                }
              >
                {action === "editPost" && isSubmitting ? (
                  <>
                    <span
                      className="inline-block size-5 animate-spin rounded-full border-[3px] border-white border-t-transparent text-blue-600"
                      role="status"
                      aria-labelledby="edit-label"
                    ></span>
                    <span id="edit-label">Editing</span>
                  </>
                ) : (
                  "Edit"
                )}
              </Button>
              <Button
                size="small"
                variant="ghost"
                disabled={isSubmitting}
                onClick={removePost}
                className={
                  action === "deletePost" && isSubmitting ? "animate-pulse" : ""
                }
              >
                {action === "deletePost" && isSubmitting ? (
                  <>
                    <span
                      className="inline-block size-5 animate-spin rounded-full border-[3px] border-white border-t-transparent text-blue-600"
                      role="status"
                      aria-labelledby="delete-label"
                    ></span>
                    <span id="delete-label">deleting</span>
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
