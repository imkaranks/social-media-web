export default function Stories() {
  return (
    <div className="flex h-48 justify-between gap-2 overflow-x-hidden">
      {new Array(10).fill(0).map((_, idx) => (
        <div
          className="relative isolate flex w-1/5 min-w-28 max-w-32 flex-shrink-0 flex-col items-center justify-between overflow-hidden rounded-xl bg-gray-200 bg-cover bg-center bg-no-repeat p-4 text-xs before:absolute before:top-0 before:-z-10 before:h-full before:w-full before:bg-gradient-to-b before:from-black/30 before:to-black before:content-[''] dark:bg-neutral-700"
          style={{
            backgroundImage: `url("https://picsum.photos/id/${237 + idx}/200/300/")`,
          }}
          key={idx}
        >
          <img
            className="inline-block size-10 rounded-full sm:size-11 md:size-12"
            src={`https://i.pravatar.cc/150?img=${idx + 10}`}
            alt="Someone"
          />
          <p className="text-white">Lorem, ipsum.</p>
        </div>
      ))}
    </div>
  );
}
