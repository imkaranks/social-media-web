export default function SecondStep({
  avatarPreview,
  setAvatarPreview,
  fullname,
  username,
  updateFormData,
}) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    updateFormData({ avatar: file });

    const reader = new FileReader();

    reader.onload = (event) => {
      setAvatarPreview(event.target.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="grid">
        <label
          htmlFor="avatar"
          className="mb-2 block text-sm font-medium dark:text-white"
        >
          Choose your avatar
        </label>
        <div className="flex items-center gap-2 2xl:gap-4">
          <img
            className="inline-block size-12 flex-shrink-0 rounded-full bg-white/5 object-cover"
            src={
              avatarPreview ||
              "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
            }
          />
          <input
            type="file"
            name="avatar"
            id="avatar"
            onChange={handleFileChange}
            className="flex-1 rounded-full bg-black/5 text-sm file:m-2 file:inline-flex file:items-center file:rounded-full file:border file:border-transparent file:bg-blue-600 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white file:hover:bg-blue-700 file:disabled:pointer-events-none file:disabled:opacity-50 dark:bg-white/5"
            placeholder="John Doe"
          />
        </div>
      </div>
      <div className="grid">
        <label
          htmlFor="fullname"
          className="mb-2 block text-sm font-medium dark:text-white"
        >
          Fullname
        </label>
        <input
          type="text"
          name="fullname"
          id="fullname"
          value={fullname}
          onChange={(e) => updateFormData({ fullname: e.target.value })}
          className="block w-full rounded-lg border-2 border-gray-200 bg-transparent px-4 py-3 text-sm focus:border-blue-500 focus:ring-0 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:border-neutral-600 dark:focus:ring-neutral-600"
          placeholder="John Doe"
        />
      </div>
      <div className="grid">
        <label
          htmlFor="username"
          className="mb-2 block text-sm font-medium dark:text-white"
        >
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={(e) => updateFormData({ username: e.target.value })}
          className="block w-full rounded-lg border-2 border-gray-200 bg-transparent px-4 py-3 text-sm focus:border-blue-500 focus:ring-0 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:border-neutral-600 dark:focus:ring-neutral-600"
          placeholder="im_johnboi"
        />
      </div>
    </>
  );
}
