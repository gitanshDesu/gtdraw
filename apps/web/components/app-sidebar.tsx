import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@gtdraw/ui/components/sidebar";

export function AppSidebar() {
  return (
    <Sidebar className="md:w-[14rem] lg:w-[16rem]">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
