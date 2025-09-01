import * as React from "react";
import { __ } from "@wordpress/i18n";
import { Command } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { items } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-right text-sm leading-tight text-cream-700">
                  <span className="truncate font-medium">
                    {__("Clean Admin", "payamito-plus")}
                  </span>
                  <span className="truncate text-xs">
                    {__("Wpstorm Genius")}
                  </span>
                </div>
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
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className="font-medium">
                        {({ isActive }) => (
                          <li
                            className={`flex items-center gap-2 w-full text-right text-sm font-medium p-4 pb-3 text-cream-700 ${
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
                    {/* {item.items?.length ? (
                      <SidebarMenuSub>
                        {item.items.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton
                              asChild
                              className="outline-none shadow-none hover:bg-transparent active:bg-transparent focus:bg-transparent"
                            >
                              <NavLink
                                to={item.url}
                                className="w-full rounded-lg"
                                onClick={() => {
                                  isMobile ? toggleSidebar : undefined;
                                }}
                              >
                                {item.title}
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    ) : null} */}
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
