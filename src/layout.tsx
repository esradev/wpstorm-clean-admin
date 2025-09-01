import AppHeader from "@/components/app-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <AppHeader />
          {children}
          <Toaster
            position="bottom-center"
            richColors={true}
            closeButton={true}
            swipeDirections={["top", "right", "bottom", "left"]}
          />
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}
