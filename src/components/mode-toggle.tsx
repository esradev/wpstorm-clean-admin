import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [mode, setMode] = useState<"light" | "dark" | "system">(theme);

  // Sync internal mode with external theme changes
  useEffect(() => {
    setMode(theme as "light" | "dark" | "system");
  }, [theme]);

  const cycleMode = () => {
    const nextMode =
      mode === "light" ? "dark" : mode === "dark" ? "system" : "light";
    setTheme(nextMode);
    setMode(nextMode);
  };

  const getIcon = () => {
    if (mode === "light") return <Sun className="h-4 w-4" />;
    if (mode === "dark") return <Moon className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  return (
    <button
      onClick={cycleMode}
      className="p-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
      aria-label={__("Toggle theme", "wpstorm-clean-admin")}
    >
      {getIcon()}
      <span className="sr-only">
        {__("Toggle theme", "wpstorm-clean-admin")}
      </span>
    </button>
  );
}
