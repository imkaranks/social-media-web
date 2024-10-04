import { useContext } from "react";
import { SignUpContext } from "@/pages/Auth/SignUp";

export const useSignUpContext = () => {
  const context = useContext(SignUpContext);

  if (context === null) {
    throw new Error("useSignUpContext must be used within SignUp component");
  }

  return context;
};
