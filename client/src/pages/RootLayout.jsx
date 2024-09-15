import { useState } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";

export default function RootLayout() {
  const [expanded, setExpanded] = useState(true);

  return (
    <>
      <Topbar />

      <main
        className="relative mx-auto grid max-w-screen-2xl grid-cols-[--cols] transition-[grid-template-columns] md:grid-cols-[--cols-md] md:gap-4 xl:grid-cols-[--cols-xl]"
        style={{
          "--cols": `${expanded ? "auto" : "0"} 1fr 0`,
          "--cols-md": `${expanded ? "auto" : "0"} 1fr 30vw`,
          "--cols-xl": `${expanded ? "min(18vw, 17.28rem)" : "0"} auto min(20vw, 307.2px)`,
        }}
      >
        <LeftSidebar expanded={expanded} setExpanded={setExpanded} />
        <Outlet />
        <RightSidebar />
      </main>
    </>
  );
}
