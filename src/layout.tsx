import AppHeader from "@/components/app-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background text-foreground">
          <AppSidebar side="right" />
          <SidebarInset className="flex flex-1 lg:-mr-5 h-full">
            <AppHeader />
            {children}
            <Toaster
              position="bottom-center"
              richColors={true}
              closeButton={true}
              swipeDirections={["top", "right", "bottom", "left"]}
            />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
