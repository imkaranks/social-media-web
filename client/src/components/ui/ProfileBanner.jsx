export const ProfileBannerSkeleton = () => {
  return (
    <div className="relative min-h-48 animate-pulse bg-black/5 dark:bg-white/30">
      <div className="absolute bottom-0 left-4 size-24 translate-y-1/2 rounded-full bg-black/5 dark:bg-white/30"></div>
    </div>
  );
};

export default function ProfileBanner({ avatar, name, banner }) {
  return (
    <div
      className="relative min-h-48 bg-gray-200 bg-[image:var(--bg-image)] bg-cover bg-center bg-no-repeat dark:bg-neutral-700"
      style={{
        "--bg-image": `url(${banner})`,
      }}
    >
      {avatar?.url ? (
        <img
          className="absolute bottom-0 left-4 inline-block size-24 flex-shrink-0 translate-y-1/2 rounded-full border-4 border-white bg-gray-200 object-cover dark:border-neutral-800 dark:bg-neutral-700"
          src={avatar.url}
          alt={name}
        />
      ) : (
        <span className="absolute bottom-0 left-4 inline-flex size-24 flex-shrink-0 translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-gray-100 text-2xl font-semibold leading-none text-gray-800 dark:border-neutral-800 dark:bg-neutral-700 dark:text-white">
          {name?.split(" ").map((word) => word[0].toUpperCase())}
        </span>
      )}
    </div>
  );
}
