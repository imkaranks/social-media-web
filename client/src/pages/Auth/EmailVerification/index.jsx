import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "@/components/ui/Loader";
import axios from "@/app/axios";

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
      <div className="mx-auto w-11/12 max-w-md bg-gray-100 p-6 dark:bg-neutral-700 md:mx-auto">
        {isLoading ? (
          <div className="[&>*]:!h-80">
            <Loader />
          </div>
        ) : success ? (
          <>
            <svg
              viewBox="0 0 24 24"
              className="mx-auto my-6 h-16 w-16 text-green-600"
            >
              <path
                fill="currentColor"
                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
              ></path>
            </svg>
            <div className="text-center">
              <h3 className="text-center text-lg font-semibold sm:text-xl 2xl:text-2xl">
                Verification Done!
              </h3>
              <p className="my-2 text-gray-400 dark:text-neutral-500">
                Thank you for completing your email verification.
              </p>
              <p className="text-gray-400 dark:text-neutral-500">
                Have a great day!
              </p>
              <div className="py-10 text-center">
                <Link
                  className="rounded-lg bg-indigo-600 px-12 py-3 font-semibold text-white hover:bg-indigo-500 max-2xl:text-sm"
                  to="/sign-in"
                >
                  Login
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <svg
              viewBox="0 0 24 24"
              className="mx-auto my-6 h-16 w-16 text-red-600"
            >
              <path
                fill="currentColor"
                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
              ></path>
            </svg>
            <div className="text-center">
              <h3 className="text-center text-lg font-semibold sm:text-xl 2xl:text-2xl">
                Verification Failed!
              </h3>
              <p className="my-2 text-gray-400 dark:text-neutral-500">
                Please try again after some time.
              </p>
              <p className="text-gray-400 dark:text-neutral-500">
                Have a great day!
              </p>
              <div className="py-10 text-center">
                <button
                  disabled={isSubmitting}
                  className="min-w-[11.9375rem] rounded-lg bg-indigo-600 px-12 py-3 font-semibold text-white hover:bg-indigo-500 disabled:bg-indigo-600/60 max-2xl:text-sm"
                  onClick={resendToken}
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
                    <span>Resend Token</span>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
