import Input from "@/components/ui/Input";
import ImageFileInput from "@/components/ui/ImageFileInput";

export default function SecondStep({
  avatarPreview,
  handleAvatarChange,
  fullname,
  username,
  updateFormData,
}) {
  const handleChange = (event) => {
    handleAvatarChange(event, (file) => updateFormData({ avatar: file }));
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
        name="fullname"
        value={fullname}
        onChange={(e) => updateFormData({ fullname: e.target.value })}
        placeholder="John Doe"
      />
      <Input
        label="Username"
        type="text"
        name="username"
        value={username}
        onChange={(e) => updateFormData({ username: e.target.value })}
        placeholder="im_johnboi"
      />
    </>
  );
}
