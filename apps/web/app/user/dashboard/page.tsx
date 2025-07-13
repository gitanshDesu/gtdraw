"use client";
import { AppSidebar } from "@/components/app-sidebar";
import DashNav from "@/components/dash-nav";
import Table from "@/components/dash-table";
import { SidebarProvider, SidebarTrigger } from "@gtdraw/ui/components/sidebar";
import { useState } from "react";

export default function Dashboard() {
  return (
    <SidebarProvider className=" min-h-screen min-w-screen">
      <AppSidebar />
      <main>
        <SidebarTrigger className="fixed top-2 left-2" />
      </main>
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 sm:-translate-x-3/5 md:-translate-x-1/2 lg:-translate-x-3/5 z-50 md:left-3/5 md:px-2 lg:left-4/6 2xl:left-3/4 xl:-translate-x-3/4 2xl:-translate-x-full min-[2560px]:left-3/4 min-[2560px]:-translate-x-full ">
        <DashNav />
      </div>
      <div className="relative top-[150px] min-w-full">
        <Table />
      </div>
    </SidebarProvider>
  );
}
