import { Outlet } from "react-router-dom";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Topbar from "@/components/shared/Topbar";

export default function MessagesLayout() {
  return (
    <>
      <Topbar />

      <main className="relative mx-auto grid max-w-screen-2xl grid-cols-[auto_1fr] md:grid-cols-[auto_1fr] xl:grid-cols-[min(18vw,_276.48px)_1fr]">
        <LeftSidebar />
        <Outlet />
      </main>
    </>
  );
}
