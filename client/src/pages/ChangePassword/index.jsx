// import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useChangePassword from "@/hooks/useChangePassword";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const initialState = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

// const schema = z
//   .object({
//     oldPassword: z.string().min(6, "Old password must be 6 character long"),
//     newPassword: z.string().min(6, "New password must be 6 character long"),
//     confirmPassword: z
//       .string()
//       .min(6, "Confirm password must be 6 character long"),
//   })
//   .refine((data) => data.newPassword === data.confirmPassword, {
//     message: "New password and confirm password must match",
//     path: ["confirmPassword"],
//   });
const schema = z
  .object({
    oldPassword: z.string().min(6).max(20),
    newPassword: z.string().min(6).max(20),
    confirmPassword: z.string().min(6).max(20),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password must match",
    path: ["confirmPassword"],
  });

export default function ChangePassword() {
  const navigate = useNavigate();
  const { changePassword, isSubmitting } = useChangePassword();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: initialState,
    resolver: zodResolver(schema),
  });

  console.log(errors);

  const onSubmit = (data) => {
    try {
      const { oldPassword, newPassword, confirmPassword } = data;

      // await changePassword(oldPassword, newPassword, confirmPassword);

      // navigate("/settings?tab=security");
      console.log("success");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : error;
      console.error(errorMessage);
      setError("root", {
        message: errorMessage,
      });
    }
  };

  return (
    <div className="grid min-h-screen place-items-center">
      <div className="mx-auto w-11/12 max-w-lg md:max-w-2xl lg:w-4/5">
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          <div className="grid size-14 place-items-center rounded-full bg-blue-400/5 text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </div>

          <header className="space-y-4">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              Change Password
            </h1>
            <p className="text-sm">
              To change your password, please fill in the fields below. Your
              password must contain at least 6 characters, it must also include
              at least one upper case letter, one lowercase letter, one number
              and one special character.
            </p>
          </header>

          <form
            className="space-y-4 md:space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              label="Current Password"
              type="password"
              {...register("oldPassword")}
              error={errors.oldPassword}
              placeholder="••••••••"
            />
            <Input
              label="New Password"
              type="password"
              {...register("newPassword")}
              error={errors.newPassword}
              placeholder="••••••••"
            />
            <Input
              label="Confirm Password"
              type="password"
              {...register("confirmPassword")}
              error={errors.confirmPassword}
              placeholder="••••••••"
            />

            <Button
              size="large"
              type="submit"
              disabled={isSubmitting}
              className="!mt-6 w-full justify-center md:!mt-8"
            >
              {isSubmitting ? (
                <div
                  className="inline-block size-5 animate-spin rounded-full border-[3px] border-white border-t-transparent text-blue-600"
                  role="status"
                  aria-label="loading"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <span>Update Password</span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
