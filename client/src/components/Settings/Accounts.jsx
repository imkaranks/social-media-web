import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useImageInput from "@/hooks/useImageInput";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ProfileBanner from "@/components/ui/ProfileBanner";

const initialData = {
  fullname: "",
  username: "",
  email: "",
  bio: "",
  avatar: null,
  banner: null,
};

export default function Accounts() {
  const { auth, setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const {
    image: avatar,
    imagePreview: avatarPreview,
    handleChange: avatarChange,
  } = useImageInput();
  const {
    image: banner,
    imagePreview: bannerPreview,
    handleChange: bannerChange,
  } = useImageInput();

  const [data, setData] = useState(initialData);
  const [editing, setEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!editing) {
      setEditing(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      for (const field in data) {
        if (data[field]) formData.append(field, data[field]);
      }

      if (avatar) formData.append("avatar", avatar);
      if (banner) formData.append("banner", banner);

      const response = await axiosPrivate.patch(
        `/user/${auth?.user?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setData(initialData);
      setAuth((prevAuth) => ({
        ...prevAuth,
        user: response?.data?.data,
      }));
      setEditing(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Error occured while updating account details",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const setExistingUserData = useCallback(() => {
    const existingUser = {};
    Object.entries(auth?.user).forEach(([key, val]) => {
      if (key !== "avatar" && key !== "banner") {
        existingUser[key] = val;
      }
    });

    setData((prevData) => ({
      ...prevData,
      ...existingUser,
    }));
  }, [auth]);

  const cancelEditing = useCallback(() => {
    setExistingUserData();
    setEditing(false);
  }, [setExistingUserData]);

  useEffect(() => {
    setExistingUserData();
  }, [setExistingUserData]);

  return (
    <div>
      <ProfileBanner
        editable={editing}
        avatar={avatarPreview || auth?.user?.avatar.url}
        avatarOnChange={avatarChange}
        banner={bannerPreview || auth?.user?.banner?.url}
        bannerOnChange={bannerChange}
        name={auth?.user?.username}
      />

      <form className="mt-14 flex flex-col gap-8" onSubmit={handleSubmit}>
        <div>
          <h2>Account Settings</h2>
        </div>

        <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2">
          <Input
            label="Fullname"
            name="fullname"
            disabled={!editing}
            value={data.fullname}
            onChange={handleChange}
          />
          <Input
            label="Username"
            name="username"
            disabled={!editing}
            value={data.username}
            onChange={handleChange}
          />
          <div className="col-span-2">
            <Input
              label="Bio"
              name="bio"
              disabled={!editing}
              value={data.bio}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="ml-auto flex gap-4">
          <Button disabled={isSubmitting} className="ml-auto">
            {!editing ? "Change" : "Save"}
          </Button>
          {editing && (
            <Button
              type="button"
              variant="ghost"
              disabled={isSubmitting}
              onClick={cancelEditing}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
