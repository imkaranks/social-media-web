import { cva } from "class-variance-authority";
import { cn } from "@/utils/cn";

const avatarVariants = cva(
  "inline-flex justify-center items-center rounded-full object-cover object-center bg-gray-100 text-sm font-semibold leading-none text-gray-800 dark:bg-white/10 dark:text-white",
  {
    variants: {
      size: {
        xsmall: "size-9",
        small: "size-[38px]",
        medium: "size-[46px]",
        large: "size-14",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  },
);

export default function Avatar({ className, size, user, ...props }) {
  return user?.avatar?.url ? (
    <img
      className={cn(avatarVariants({ size }), className)}
      {...props}
      src={user.avatar.url}
      alt={user?.fullname}
    />
  ) : (
    <span className={cn(avatarVariants({ size }), className)}>
      {user?.fullname?.split(" ").map((word) => word[0].toUpperCase())}
    </span>
  );
}
