"use client";
import Sidebar from "@/app/components/client/sidebar";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showSidebar, setShowSidebar] = React.useState(false);
  return (
    <div lang="en" className="h-full flex ">
      <Sidebar isOpen={showSidebar} />
      <div className="flex-1 flex flex-col h-full">
        <div className="border-b border-b-gray-300 p-[5px]">
          <div
            className="cursor-pointer"
            onClick={() => {
              setShowSidebar(!showSidebar);
            }}
          >
            <div className="w-[35px] h-[4px] bg-black my-1"></div>
            <div className="w-[35px] h-[4px] bg-black my-1"></div>
            <div className="w-[35px] h-[4px] bg-black my-1"></div>
          </div>
        </div>
        <div className="p-[5px] flex-1 min-h-0">{children}</div>
      </div>
    </div>
  );
}
