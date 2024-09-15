import { useId } from "react";
import Button from "@/components/ui/Button";

export default function ImageFileInput({
  label,
  imagePreview,
  children,
  ...props
}) {
  const id = useId();

  return (
    <div className="flex gap-4">
      <img
        className="block size-12 flex-shrink-0 rounded-full bg-white/5 object-cover"
        src={
          imagePreview ||
          "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
        }
      />
      <div className="flex flex-col items-start justify-center">
        {children}
        <Button as="label" className="relative" htmlFor={id}>
          <span>{label}</span>
          <input
            className="invisible absolute inset-0 opacity-0 outline-none"
            type="file"
            id={id}
            accept="image/*"
            {...props}
          />
        </Button>
      </div>
    </div>
  );
}
