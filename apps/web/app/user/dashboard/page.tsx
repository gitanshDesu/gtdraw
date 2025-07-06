import { AppSidebar } from "@/components/app-sidebar";
import DashNav from "@/components/dash-nav";
import { SidebarProvider, SidebarTrigger } from "@gtdraw/ui/components/sidebar";

export default function Dashboard() {
  return (
    <SidebarProvider className=" min-h-screen min-w-full ">
      <AppSidebar />
      <main>
        <SidebarTrigger className="fixed top-2 left-2" />
      </main>
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 md:left-3/5 md:px-2">
        <DashNav />
      </div>
    </SidebarProvider>
  );
}
