import { Outlet } from "react-router-dom";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Topbar from "@/components/shared/Topbar";
import RightSidebar from "@/components/shared/RightSidebar";

export default function RootLayout() {
  return (
    <>
      <Topbar />

      <main className="relative mx-auto grid max-w-screen-2xl grid-cols-[auto_1fr_0] md:grid-cols-[auto_1fr_30vw] md:gap-4 xl:grid-cols-[min(18vw,_276.48px)_auto_min(20vw,_307.2px)]">
        <LeftSidebar />
        <Outlet />
        <RightSidebar />
      </main>
    </>
  );
}
