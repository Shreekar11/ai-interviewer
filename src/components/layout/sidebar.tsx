"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Home, LogOut, User, LaptopMinimal, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

// Main menu items
const mainItems = [
  {
    title: "Dashboard",
    url: "/dashboard",  
    icon: Home,
    badge: null,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
    badge: null,
  },
  {
    title: "Personal Interviews",
    url: "/interviews/personal",
    icon: LaptopMinimal,
    badge: null,
  },
  {
    title: "Custom Interviews",
    url: "/interviews/custom",
    icon: FileText,
    badge: null,
  },
];

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <Sidebar className="border-r border-border bg-card">
      <SidebarContent className="p-0">
        {/* Logo and Brand */}
        <div className="text-xl font-bold flex items-center px-4 py-5 border-b">
          Dashboard
        </div>

        <div className="px-2 py-2">
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground">
              MAIN MENU
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <TooltipProvider delayDuration={0}>
                  {mainItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            className={cn(
                              `group flex w-full items-center rounded-md px-3 py-2 hover:bg-blue-50
                               hover:text-accent-foreground focus-visible:outline-none`,
                              activeItem === item.title
                                ? "bg-blue-100 text-accent-foreground"
                                : "transparent"
                            )}
                            onClick={() => setActiveItem(item.title)}
                          >
                            <Link
                              href={item.url}
                              className="flex w-full items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <item.icon className="h-5 w-5" />
                                <span className="font-medium">
                                  {item.title}
                                </span>
                              </div>
                              {item.badge && (
                                <div
                                  className="flex h-5 w-5 items-center justify-center 
                                rounded-full bg-blue-600 text-xs font-medium text-white"
                                >
                                  {item.badge}
                                </div>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          className="flex items-center gap-2"
                        >
                          {item.title}
                          {item.badge && (
                            <span
                              className="flex h-5 w-5 items-center justify-center 
                            rounded-full bg-blue-600 text-xs font-medium text-white"
                            >
                              {item.badge}
                            </span>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  ))}
                </TooltipProvider>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src="/placeholder.svg?height=36&width=36"
                alt="User"
              />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">John Peterson</p>
              <p className="text-xs text-muted-foreground">john@example.com</p>
            </div>
          </div>
          <button className="rounded-md p-1 hover:bg-accent">
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
