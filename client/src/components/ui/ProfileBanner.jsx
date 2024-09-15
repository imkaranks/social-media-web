import Button from "@/components/ui/Button";

export const ProfileBannerSkeleton = () => {
  return (
    <div className="relative min-h-48 animate-pulse bg-black/5 dark:bg-white/30">
      <div className="absolute bottom-0 left-4 size-24 translate-y-1/2 rounded-full bg-black/5 dark:bg-white/30"></div>
    </div>
  );
};

export default function ProfileBanner({
  avatar,
  avatarOnChange,
  name,
  banner,
  bannerOnChange,
  editable,
}) {
  return (
    <div
      className="relative min-h-48 bg-gray-200 bg-[image:var(--bg-image)] bg-cover bg-center bg-no-repeat dark:bg-neutral-700"
      style={{
        "--bg-image": `url(${banner})`,
      }}
    >
      {editable && (
        <Button
          as="label"
          variant="ghost"
          size="small"
          className="absolute right-4 top-4"
        >
          <span>Edit Banner</span>
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
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
          <input
            type="file"
            className="invisible absolute inset-0 opacity-0 outline-none"
            name="banner"
            id="banner"
            onChange={bannerOnChange}
          />
        </Button>
      )}

      {avatar ? (
        editable ? (
          <div className="absolute bottom-0 left-4 size-24 flex-shrink-0 translate-y-1/2 rounded-full border-4 border-white dark:border-neutral-800">
            <img
              className="inline-block h-full w-full rounded-full object-cover"
              src={avatar}
              alt={name}
            />
            <Button
              as="label"
              className="absolute right-0 top-0 rounded-full p-1"
            >
              <span className="sr-only">Edit Avatar</span>
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
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              <input
                type="file"
                className="invisible absolute inset-0 opacity-0 outline-none"
                name="avatar"
                id="avatar"
                onChange={avatarOnChange}
              />
            </Button>
          </div>
        ) : (
          <img
            className="absolute bottom-0 left-4 inline-block size-24 flex-shrink-0 translate-y-1/2 rounded-full border-4 border-white bg-gray-200 object-cover dark:border-neutral-800 dark:bg-neutral-700"
            src={avatar}
            alt={name}
          />
        )
      ) : (
        <span className="absolute bottom-0 left-4 inline-flex size-24 flex-shrink-0 translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-gray-100 text-2xl font-semibold leading-none text-gray-800 dark:border-neutral-800 dark:bg-neutral-700 dark:text-white">
          {name?.split(" ").map((word) => word[0].toUpperCase())}
        </span>
      )}
    </div>
  );
}
