import { NavLink } from "react-router-dom";
import { __ } from "@wordpress/i18n";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { items } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppSidebar() {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar side="right" className="w-64 bg-payamito-plus-600 pb-8">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <span className="truncate font-semibold">
                  {__("Smart Payamito Plus plugin", "payamito-plus")}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items
                .filter((item) => item.isVisiable)
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="outline-none shadow-none hover:bg-transparent active:bg-transparent focus:bg-transparent"
                    >
                      <NavLink
                        onClick={isMobile ? toggleSidebar : undefined}
                        to={item.url}
                        className="w-full rounded-lg"
                      >
                        {({ isActive }) => (
                          <li
                            className={`flex items-center gap-2 w-full text-right text-sm font-medium p-4 pb-3 text-white ${
                              isActive ? "bg-payamito-plus-800" : ""
                            }`}
                          >
                            {" "}
                            <item.icon className="w-4 h-4" />
                            {item?.title}
                          </li>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
