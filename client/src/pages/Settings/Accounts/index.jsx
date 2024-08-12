import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useImageInput from "@/hooks/useImageInput";

export default function Accounts() {
  const { auth, setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const {
    image: avatar,
    imagePreview: avatarPreview,
    handleChange: onAvatarChange,
    resetImage: resetAvatar,
  } = useImageInput();

  const [isAvatarEditing, setIsAvatarEditing] = useState(false);
  const [isAvatarSubmitting, setIsAvatarSubmitting] = useState(false);

  const changeAvatar = async () => {
    setIsAvatarSubmitting(true);

    try {
      if (avatar === null) throw new Error("Avatar is missing");

      const formData = new FormData();

      formData.set("avatar", avatar);

      const response = await axiosPrivate.patch(
        `user/avatar/${auth?.user?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      resetAvatar();
      setIsAvatarEditing(false);

      setAuth((prevAuth) => ({
        ...prevAuth,
        user: response?.data?.data,
      }));
    } catch (error) {
      console.log(error?.message);
    } finally {
      setIsAvatarSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="mb-4 text-lg font-semibold">Account Settings</h2>

      <div className="mb-4 flex gap-4 rounded-lg border border-gray-200 p-4 dark:border-neutral-700">
        <div className="flex flex-1 items-center">
          <div className="grid">
            <img
              className="inline-block size-14 flex-shrink-0 rounded-full object-cover"
              src={avatarPreview || auth?.user?.avatar?.url}
              alt={auth?.user?.fullname}
            />
            {isAvatarEditing && (
              <input
                type="file"
                name="avatar"
                id="avatar"
                accept="image/*"
                onChange={onAvatarChange}
              />
            )}
          </div>
          <div className="ms-3">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              {auth?.user?.fullname}
            </h3>
            <p className="text-sm font-medium text-gray-400 dark:text-neutral-500">
              {auth?.user?.email}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 2xl:gap-4">
          {!isAvatarEditing ? (
            <button
              onClick={() => setIsAvatarEditing(true)}
              className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:text-white"
            >
              Edit
            </button>
          ) : (
            <>
              {avatar !== null && (
                <button
                  onClick={changeAvatar}
                  disabled={isAvatarSubmitting}
                  className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:text-white"
                >
                  Save
                </button>
              )}
              <button
                disabled={isAvatarSubmitting}
                onClick={() => {
                  resetAvatar();
                  setIsAvatarEditing(false);
                }}
                className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:text-white"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mb-4 flex gap-4 rounded-lg border border-gray-200 p-4 dark:border-neutral-700">
        <div className="flex-1">
          <h3 className="mb-5 font-medium 2xl:text-lg">Personal information</h3>

          <form className="grid gap-4 md:grid-cols-2 lg:w-4/5">
            <div className="grid w-full space-y-2">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium dark:text-white"
              >
                First name
              </label>
              <input
                type="text"
                id="first-name"
                className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                value={auth?.user?.fullname?.split(" ")[0]}
                disabled
                aria-describedby="first-name-hint"
              />
              {false && (
                <p
                  className="text-sm text-gray-500 dark:text-neutral-500"
                  id="first-name-hint"
                >
                  We&apos;ll never share your details.
                </p>
              )}
            </div>
            <div className="grid w-full space-y-2">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium dark:text-white"
              >
                Last name
              </label>
              <input
                type="text"
                id="last-name"
                className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                value={auth?.user?.fullname?.split(" ")[1]}
                disabled
                aria-describedby="last-name-hint"
              />
              {false && (
                <p
                  className="text-sm text-gray-500 dark:text-neutral-500"
                  id="last-name-hint"
                >
                  We&apos;ll never share your details.
                </p>
              )}
            </div>
            <div className="grid w-full space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium dark:text-white"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                value={auth?.user?.username}
                disabled
                aria-describedby="username-hint"
              />
              {false && (
                <p
                  className="text-sm text-gray-500 dark:text-neutral-500"
                  id="username-hint"
                >
                  We&apos;ll never share your details.
                </p>
              )}
            </div>
            <div className="grid w-full space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium dark:text-white"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder="you@site.com"
                value={auth?.user?.email}
                disabled
                aria-describedby="hs-inline-input-helper-text"
              />
              {false && (
                <p
                  className="text-sm text-gray-500 dark:text-neutral-500"
                  id="hs-inline-input-helper-text"
                >
                  We&apos;ll never share your details.
                </p>
              )}
            </div>
          </form>
        </div>
        <div>
          <button className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:text-white">
            Edit
          </button>
        </div>
      </div>

      <div className="mb-4 flex gap-4 rounded-lg border border-gray-200 p-4 dark:border-neutral-700">
        <div className="flex-1">
          <h3 className="mb-5 font-medium 2xl:text-lg">Preferences</h3>

          <form className="grid gap-4 lg:w-4/5">
            <div className="grid w-full space-y-2">
              <label
                htmlFor="lang"
                className="block text-sm font-medium dark:text-white"
              >
                Language
              </label>
              <select
                id="lang"
                className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                disabled
              >
                <option value="en" selected>
                  English
                </option>
                <option value="fr">French</option>
              </select>
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-medium dark:text-white">
                Notification Preferences
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                <label
                  htmlFor="hs-radio-in-form"
                  className="flex w-full rounded-lg border border-gray-200 bg-white p-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
                >
                  <input
                    type="radio"
                    name="hs-radio-in-form"
                    disabled
                    className="mt-0.5 shrink-0 rounded-full border-gray-200 text-blue-600 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
                    id="hs-radio-in-form"
                  />
                  <span className="ms-3 text-sm text-gray-500 dark:text-neutral-400">
                    Push Notification
                  </span>
                </label>
                <label
                  htmlFor="hs-radio-checked-in-form"
                  className="flex w-full rounded-lg border border-gray-200 bg-white p-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
                >
                  <input
                    type="radio"
                    name="hs-radio-in-form"
                    disabled
                    className="mt-0.5 shrink-0 rounded-full border-gray-200 text-blue-600 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
                    id="hs-radio-checked-in-form"
                    defaultChecked=""
                  />
                  <span className="ms-3 text-sm text-gray-500 dark:text-neutral-400">
                    Email Notification
                  </span>
                </label>
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-sm font-medium dark:text-white">
                Privacy Settings
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                <label
                  htmlFor="hs-radio-in-form"
                  className="flex w-full rounded-lg border border-gray-200 bg-white p-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
                >
                  <input
                    type="radio"
                    name="hs-radio-in-form"
                    disabled
                    className="mt-0.5 shrink-0 rounded-full border-gray-200 text-blue-600 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
                    id="hs-radio-in-form"
                  />
                  <span className="ms-3 text-sm text-gray-500 dark:text-neutral-400">
                    Public
                  </span>
                </label>
                <label
                  htmlFor="hs-radio-checked-in-form"
                  className="flex w-full rounded-lg border border-gray-200 bg-white p-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
                >
                  <input
                    type="radio"
                    name="hs-radio-in-form"
                    disabled
                    className="mt-0.5 shrink-0 rounded-full border-gray-200 text-blue-600 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
                    id="hs-radio-checked-in-form"
                    defaultChecked=""
                  />
                  <span className="ms-3 text-sm text-gray-500 dark:text-neutral-400">
                    Private
                  </span>
                </label>
              </div>
            </fieldset>
          </form>
        </div>
        <div>
          <button className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:text-white">
            Edit
          </button>
        </div>
      </div>
    </>
  );
}
