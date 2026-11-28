import { LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BrandLogo } from "@/components/common/BrandLogo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const username = user?.username ?? "Użytkownik";
  const initial = username.charAt(0).toUpperCase();

  function handleLogout() {
    logout();
    toast.info("Wylogowano z konta.");
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-card/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/dashboard"
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <BrandLogo size="sm" />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <Separator orientation="vertical" className="h-6" />

          <div
            className="flex items-center gap-2 rounded-full border bg-secondary/60 py-1 pr-3 pl-1.5"
            title={username}
          >
            <span
              aria-hidden="true"
              className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
            >
              {initial}
            </span>
            <span className="max-w-32 truncate text-sm font-medium text-foreground sm:max-w-48">
              {username}
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            <span>Wyloguj</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
