import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="grid h-screen gap-4 md:grid-cols-2 lg:grid-cols-[1fr_1.1fr]">
      <div className="grid place-items-center">
        <Outlet />
      </div>
      <div className="relative max-md:hidden">
        <img
          src="https://plus.unsplash.com/premium_vector-1716908378405-23490523fa27?bg=FFFFFF&w=1500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c29jaWFsJTIwbWVkaWF8ZW58MHx8MHx8fDA%3D"
          className="absolute left-0 top-0 h-full w-full object-cover object-center"
          alt=""
        />
      </div>
    </div>
  );
}
