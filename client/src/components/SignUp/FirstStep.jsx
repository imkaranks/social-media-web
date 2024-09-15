import Input from "@/components/ui/Input";

export default function FirstStep({ email, password, updateFormData }) {
  return (
    <>
      <Input
        label="Email"
        type="email"
        name="email"
        value={email}
        onChange={(e) => updateFormData({ email: e.target.value })}
        placeholder="you@site.com"
      />
      <Input
        label="Password"
        type="password"
        name="password"
        value={password}
        onChange={(e) => updateFormData({ password: e.target.value })}
        placeholder="••••••••"
      />
    </>
  );
}
