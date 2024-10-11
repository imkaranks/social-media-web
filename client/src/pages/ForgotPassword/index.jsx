import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "@/app/axios";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const initialState = {
  email: "",
};

const schema = z.object({
  email: z.string().email(),
});

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      await axios.post("/user/forgot-password", data);
      reset();
      toast.success("Success! Please check your email", {
        duration: 5000,
      });
    } catch (error) {
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
        <div className="text-center">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
            Reset your password
          </h1>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Enter your email and we&apos;ll send you a link to reset your
            password.
          </p>
        </div>
        <form
          className="space-y-4 md:space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="Email"
            type="email"
            {...register("email")}
            error={errors.email}
            placeholder="you@site.com"
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
      </div>
    </div>
  );
}
