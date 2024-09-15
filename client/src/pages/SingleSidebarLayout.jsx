import { useState } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/LeftSidebar";

export default function SingleSidebarLayout() {
  const [expanded, setExpanded] = useState(true);

  return (
    <>
      <Topbar />

      <main
        className="relative mx-auto grid max-w-screen-2xl grid-cols-[--cols] transition-[grid-template-columns] md:grid-cols-[--cols-md] xl:grid-cols-[--cols-xl]"
        style={{
          "--cols": `${expanded ? "auto" : "0"} 1fr`,
          "--cols-md": `${expanded ? "auto" : "0"} 1fr`,
          "--cols-xl": `${expanded ? "min(18vw, 17.28rem)" : "0"} auto`,
        }}
      >
        <LeftSidebar expanded={expanded} setExpanded={setExpanded} />
        <Outlet />
      </main>
    </>
  );
}
