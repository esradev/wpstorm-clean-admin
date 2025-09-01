import { __ } from "@wordpress/i18n";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import NotificationCenter from "./notification-center";
import UserInfo from "./user-info";

export default function AppHeader() {
  return (
    <header className="sticky top-8 z-50 flex w-full h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex w-full h-14 items-center gap-x-2 px-4 justify-between">
        <div className="flex items-center gap-x-2">
          <SidebarTrigger />
          {/* Show current plugin version */}
          <div className="hidden md:block">
            <span
              className="text-xs bg-green-200 text-green-800 border border-green-300
            dark:bg-green-900 dark:text-green-200 dark:border-green-900
            px-2 py-1 rounded-md"
            >
              {__("Current Version: ", "wpstorm-clean-admin")}
              {payamitoPlusJsObject?.plugin_version}
            </span>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <ModeToggle />
          <NotificationCenter />
          <UserInfo />
        </div>
      </div>
    </header>
  );
}
