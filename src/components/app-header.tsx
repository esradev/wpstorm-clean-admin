import { __ } from "@wordpress/i18n";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { NotificationCenter } from "./notification-center";
import { Menu, Rocket } from "lucide-react";
import { SystemStatus } from "./system-status";

export default function AppHeader() {
  return (
    <header className="sticky top-8 z-50 flex w-full h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex w-full h-14 items-center gap-x-2 px-4 justify-between">
        <div className="flex items-center gap-x-2">
          <SidebarTrigger className="relative p-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors" />
          {/* Show current plugin version */}
          <div className="flex">
            <span
              className="text-xs p-2 bg-green-200 text-green-800 border border-green-300
            dark:bg-green-900 dark:text-green-200 dark:border-green-900 rounded-md"
            >
              <Rocket className="inline size-4 ml-1" />
              {__("Current Version: 1.0.0", "wpstorm-clean-admin")}
            </span>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <ModeToggle />
          <NotificationCenter />
          <SystemStatus />
        </div>
      </div>
    </header>
  );
}
