import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

export default function useChangePassword() {
  const axiosPrivate = useAxiosPrivate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changePassword = useCallback(
    async (oldPassword, newPassword, confirmPassword) => {
      setIsSubmitting(true);

      try {
        if (
          [oldPassword, newPassword, confirmPassword].some(
            (field) => !field || !field?.trim(),
          )
        ) {
          throw new Error("Old, new and confirm password are required");
        }

        if (newPassword !== confirmPassword) {
          throw new Error("Password doesn't match");
        }

        await axiosPrivate.patch("/user/change-password", {
          oldPassword,
          newPassword,
        });

        toast.success("Password changed successfully");
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to change password";
        toast.error(message);
        throw new Error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [axiosPrivate],
  );

  return { changePassword, isSubmitting };
}
