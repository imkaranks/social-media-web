import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "@/components/ui/Loader";
import axios from "@/app/axios";
import iconSuccess from "@/assets/media/icon-success.svg";
import iconError from "@/assets/media/icon-error.svg";

export default function EmailVerification() {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const resendToken = async () => {
    setIsSubmitting(true);
    try {
      if (!token?.trim()) {
        throw new Error("No email provided");
      }
      const response = await axios.post(`/auth/resend-verification/${email}`);
      response?.data?.message && toast.success(response.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      setIsLoading(true);
      try {
        if (!token?.trim()) {
          throw new Error("No token provided");
        }
        await axios.post(`/auth/${email}/verify/${token}`);
        setSuccess(true);
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message);
        setSuccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token, email]);

  return (
    <div className="grid min-h-screen place-items-center">
      {isLoading ? (
        <Loader />
      ) : success ? (
        <div className="flex w-11/12 max-w-screen-xl items-center rounded-xl bg-gray-100 p-5 dark:bg-neutral-700 lg:h-[33rem] lg:p-[3rem_4rem]">
          <div className="mx-auto grid h-full max-w-[33rem] grid-rows-[1fr_auto] gap-6">
            <div className="flex flex-col items-center gap-8 self-center text-center">
              <figure>
                <img
                  className="w-16 sm:w-20 md:w-24 xl:w-28 2xl:w-32"
                  src={iconSuccess}
                />
              </figure>
              <h1 className="text-[clamp(2rem,_6vw,_3.75rem)] font-bold leading-none">
                Verified!
              </h1>
              <p className="w-full 2xl:text-lg">
                Thank you for verifying your email! You can now log in to your
                account to continue.
              </p>
            </div>
            <Link
              to="/sign-in"
              className={`w-full self-end rounded-lg bg-blue-500 from-indigo-400 to-indigo-500 p-[0.95rem] text-center text-white hover:bg-gradient-to-r`}
            >
              Login
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex w-11/12 max-w-screen-xl items-center rounded-xl bg-gray-100 p-5 dark:bg-neutral-700 lg:h-[33rem] lg:p-[3rem_4rem]">
          <div className="mx-auto grid h-full max-w-[33rem] grid-rows-[1fr_auto] gap-6">
            <div className="flex flex-col items-center gap-8 self-center text-center">
              <figure>
                <img
                  className="w-16 sm:w-20 md:w-24 xl:w-28 2xl:w-32"
                  src={iconError}
                />
              </figure>
              <h1 className="text-[clamp(2rem,_6vw,_3.75rem)] font-bold leading-none">
                Failed!
              </h1>
              <p className="w-full 2xl:text-lg">
                Oops! It looks like there was an issue verifying your email.
                Please double-check your email address and try again. If the
                problem persists, please try again after some time.
              </p>
            </div>
            <button
              disabled={isSubmitting}
              onClick={resendToken}
              className={`w-full self-end rounded-lg bg-blue-500 from-indigo-400 to-indigo-500 p-[0.95rem] text-white hover:bg-gradient-to-r disabled:bg-blue-500 disabled:opacity-60 disabled:hover:from-blue-500 disabled:hover:to-blue-500`}
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
                <span>Resend Link</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
