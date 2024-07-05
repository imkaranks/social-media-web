import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "@/app/axios";

export default function useVerifyEmail() {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const resendToken = useCallback(async () => {
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
  }, [email, token]);

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

  return { isLoading, success, resendToken, isSubmitting };
}
