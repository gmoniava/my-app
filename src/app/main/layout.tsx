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
      {showSidebar && <Sidebar />}
      <div className="flex-1">
        <div className="border-b">
          <div
            className="btn-primary"
            onClick={() => {
              setShowSidebar(!showSidebar);
            }}
          >
            Toggle sidebar
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
