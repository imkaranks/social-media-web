export default function PostSkeleton() {
  return (
    <div className="my-4 rounded-xl bg-black/5 p-4 dark:bg-white/5 [&_*]:animate-pulse">
      <div className="flex items-start gap-2">
        <div className="size-8 rounded-full bg-black/30 dark:bg-white/30 sm:size-9 md:size-10"></div>
        <div className="flex-1 space-y-2">
          <span className="block h-[1.5ch] w-full max-w-[6ch] bg-black/30 dark:bg-white/30"></span>
          <span className="block h-[1.5ch] w-full max-w-[16ch] bg-black/30 dark:bg-white/30"></span>
        </div>
        <div className="ml-auto self-center">
          <span className="block size-[2.5ch] rounded-lg bg-black/30 dark:bg-white/30"></span>
        </div>
      </div>

      <div className="mt-3 h-96 rounded-xl bg-black/30 dark:bg-white/30"></div>

      <div className="my-3.5 flex items-center gap-2">
        <span className="inline-block h-[3ch] w-full max-w-[5.5ch] rounded-lg bg-black/30 p-2 dark:bg-white/30"></span>
        <span className="inline-block h-[3ch] w-full max-w-[4.5ch] rounded-lg bg-black/30 p-2 dark:bg-white/30"></span>
        <span className="inline-block h-[3ch] w-full max-w-[3.5ch] rounded-lg bg-black/30 p-2 dark:bg-white/30"></span>
        <span className="ml-auto inline-block h-[3ch] w-full max-w-[4ch] rounded-lg bg-black/30 p-2 dark:bg-white/30"></span>
      </div>

      <div className="mt-3.5 flex items-center gap-2">
        <span className="inline-block size-8 rounded-full bg-black/30 p-2 dark:bg-white/30"></span>
        <span className="inline-block h-[1.5ch] w-full max-w-[12ch] bg-black/30 p-2 dark:bg-white/30"></span>
      </div>

      <div className="mt-2 h-[1.5ch] w-full max-w-[26ch] bg-black/30 p-2 dark:bg-white/30"></div>
    </div>
  );
}
