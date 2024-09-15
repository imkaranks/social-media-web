export default function Loader() {
  return (
    <div className="grid h-screen place-items-center">
      <div
        className="inline-block size-8 animate-spin rounded-full border-[3px] border-current border-t-transparent text-blue-600 dark:text-blue-500"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
