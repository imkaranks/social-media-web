import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>AuthLayout</div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
