import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AppInfoDialog from "./app-info-dialog";

export function FormHeader({
  route,
  paramId,
}: {
  route: any;
  paramId?: string;
}) {
  return (
    <section className="mb-8 font-sans">
      <div className="flex items-start justify-between gap-6 border-b border-bunker-700/50 pb-4">
        {/* Left: Icon + Title + Description */}
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-cream-500 text-white shadow-inner">
              <route.icon className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-cream-100 tracking-tight">
                {route?.title}
                {route?.infoDetails && (
                  <p className="text-sm text-bunker-300 leading-relaxed max-w-prose">
                    {route?.infoDetails}
                  </p>
                )}
              </h2>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {route?.infoDetails && <AppInfoDialog route={route} />}
          </div>
        </div>

        {/* Right: Action Button */}
        {route?.linkTo && (
          <Link to={route?.linkTo.replace(":id", paramId || "")}>
            <Button
              variant="secondary"
              size="sm"
              className="
                flex items-center gap-2
                rounded-full px-4 py-2
                bg-bunker-800 text-cream-100
                hover:bg-bunker-700 hover:text-white
                focus:ring-2 focus:ring-cream-400/50
                transition-all duration-200
              "
            >
              {route?.linkText} {route?.linkIcon && <route.linkIcon />}
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}
