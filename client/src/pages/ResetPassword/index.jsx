import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "@/app/axios";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const initialState = {
  newPassword: "",
  confirmPassword: "",
};

const schema = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." }),
    confirmPassword: z.string().min(6, {
      message: "Confirm password must be at least 6 characters long.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    // setError,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialState,
    resolver: zodResolver(schema),
  });
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  console.log(email, token);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      if (!token?.trim()) {
        throw new Error("No token provided");
      }
      if (!email?.trim()) {
        throw new Error("No email provided");
      }
      await axios.post("/user/reset-password", { ...data, email, token });
      reset();
      setSuccess(true);
      toast.success("Success! You can continue login with new password", {
        duration: 5000,
      });
    } catch (error) {
      setSuccess(false);
      toast.error(error instanceof Error ? error.message : error, {
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center">
      <div className="mx-auto w-11/12 max-w-lg space-y-4 p-6 sm:p-8 md:space-y-6 lg:w-4/5">
        {success ? (
          <>
            <div className="text-center">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
                Success!
              </h1>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                You can continue login with new password.
              </p>
            </div>
            <Button
              size="large"
              className="w-full justify-center"
              onClick={() => navigate("/sign-in")}
            >
              Back to login
            </Button>
          </>
        ) : (
          <>
            <div className="text-center">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
                Reset your password
              </h1>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Your new password must be different from previous used
                passwords.
              </p>
            </div>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
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
                className="w-full justify-center"
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
                  <span>Reset your password</span>
                )}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
