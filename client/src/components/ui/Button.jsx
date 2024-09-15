import { cva } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center gap-x-2 rounded-lg border border-transparent font-semibold disabled:pointer-events-none disabled:cursor-wait disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "transition-colors bg-blue-600 text-white hover:bg-blue-700",
        outlined:
          "border-gray-500 text-gray-500 hover:border-gray-800 hover:text-gray-800 dark:border-neutral-400 dark:text-neutral-400 dark:hover:border-neutral-300 dark:hover:text-neutral-300",
        secondary:
          "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:text-white",
        ghost:
          "text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-neutral-700",
      },
      size: {
        small: "px-3 py-2 text-xs 2xl:text-sm",
        medium: "px-3 py-2 text-sm",
        large: "px-4 py-3 text-sm 2xl:text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  },
);

export default function Button({
  className,
  variant,
  size,
  as: Component = "button",
  children,
  ...props
}) {
  return (
    <Component
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}
