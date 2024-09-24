import Input from "@/components/ui/Input";
import ImageFileInput from "@/components/ui/ImageFileInput";
import { useSignUpContext } from "./SignUp.hooks";

export default function SecondStep({
  avatarPreview,
  handleAvatarChange,
  setAvatar,
}) {
  const { register, errors } = useSignUpContext();

  const handleChange = (event) => {
    handleAvatarChange(event, (file) => setAvatar(file));
  };

  return (
    <>
      <ImageFileInput
        label="Change Avatar"
        name="avatar"
        onChange={handleChange}
        imagePreview={avatarPreview}
      />
      <Input
        label="Fullname"
        type="text"
        {...register("fullname")}
        error={errors.fullname}
        placeholder="John Doe"
      />
      <Input
        label="Username"
        type="text"
        {...register("username")}
        error={errors.username}
        placeholder="im_johnboi"
      />
    </>
  );
}
