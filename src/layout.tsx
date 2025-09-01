import AppHeader from "@/components/app-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar side="right" />
        <SidebarInset>
          <main className="flex w-full flex-col">
            <AppHeader />
            {children}
            <Toaster
              position="bottom-center"
              richColors={true}
              closeButton={true}
              swipeDirections={["top", "right", "bottom", "left"]}
            />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
