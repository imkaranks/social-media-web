import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useLogin from "@/hooks/useLogin";
import useAuth from "@/hooks/useAuth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const initialState = {
  email: "",
  password: "",
};

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function SignIn() {
  const { updateRemember } = useAuth();
  const { login, isSubmitting } = useLogin();
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

  const [remember, setRemember] = useState(true);

  const onSubmit = async (data) => {
    try {
      await login(data);
      reset();
      updateRemember(remember);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : error, {
        duration: 5000,
      });
    }
  };

  return (
    <div className="w-11/12 max-w-lg md:max-w-2xl lg:w-4/5">
      <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
          Sign in to your account
        </h1>
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
          <Input
            label="Password"
            type="password"
            {...register("password")}
            error={errors.password}
            placeholder="••••••••"
          />
          <div className="flex items-center justify-between">
            <div className="flex">
              <input
                type="checkbox"
                className="mt-0.5 shrink-0 rounded border-gray-200 text-blue-600 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
                id="remember-me"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label
                htmlFor="remember-me"
                className="ms-3 text-sm text-gray-500 dark:text-neutral-400"
              >
                Remember me
              </label>
            </div>

            <Link
              to="/forgot-password"
              className="text-primary-600 dark:text-primary-500 text-sm font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </div>

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
              <span>Sign in</span>
            )}
          </Button>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Don’t have an account yet?{" "}
            <Link
              to="/sign-up"
              className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>

        <div className="!mt-10">
          <hr className="border-black/20 dark:border-white/20" />

          <h3 className="mx-auto w-fit -translate-y-1/2 bg-white px-8 dark:bg-neutral-800 max-md:text-sm">
            Or continue with
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link
            to=""
            className="inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:text-white"
          >
            <svg className="size-5" aria-hidden="true" viewBox="0 0 24 24">
              <path
                d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                fill="#EA4335"
              />
              <path
                d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                fill="#4285F4"
              />
              <path
                d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                fill="#FBBC05"
              />
              <path
                d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                fill="#34A853"
              />
            </svg>
            <span className="text-sm font-semibold">Google</span>
          </Link>
          <Link
            to=""
            className="inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:text-white"
          >
            <svg
              className="size-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-semibold">GitHub</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
