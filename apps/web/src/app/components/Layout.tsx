import { Outlet, Link, useLocation } from "react-router";
import { Home, Heart, Droplet, Sprout, FileText, Menu, X, Calendar, Bell } from "lucide-react";
import { useState } from "react";
import { getUnreadCount } from "../utils/notificationService";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
export function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadCount = getUnreadCount();
  const { t } = useTranslation();
  const navigation = [
    { name: t("nav.dashboard"), href: "/", icon: Home },
    { name: t("nav.animals"), href: "/animals", icon: Home },
    { name: t("nav.health"), href: "/health", icon: Heart },
    { name: t("nav.medicine"), href: "/medicine", icon: Heart },
    { name: t("nav.milk"), href: "/milk", icon: Droplet },
    { name: t("nav.land"), href: "/land", icon: Sprout },
    { name: t("nav.calendar"), href: "/calendar", icon: Calendar },
    { name: t("nav.notifications"), href: "/notifications", icon: Bell },
    { name: t("nav.reports"), href: "/reports", icon: FileText },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Home className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-semibold">{t("app.name")}</h1>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <ThemeSwitcher />
              {/* Notification Bell - Desktop */}
              <Link
                to="/notifications"
                className="hidden md:block relative p-2 rounded-lg text-muted-foreground hover:bg-accent transition-colors"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-muted-foreground hover:bg-accent"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <aside
            className={`${
              mobileMenuOpen ? "block" : "hidden"
            } md:block w-full md:w-64 shrink-0`}
          >
            <nav className="bg-card rounded-lg shadow-sm p-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const showBadge = item.href === "/notifications" && unreadCount > 0;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                      active
                        ? "bg-secondary text-secondary-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                    {showBadge && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}