import Input from "@/components/ui/Input";
import { useSignUpContext } from "./SignUp.hooks";

export default function FirstStep() {
  const { register, errors } = useSignUpContext();

  return (
    <>
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
    </>
  );
}
