"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/app/components/client/sidebar";
import { logout } from "@/app/lib/auth";
import { redirect } from "next/navigation";
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
