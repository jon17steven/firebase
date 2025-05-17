'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ListChecks, ShieldCheck, Users } from "lucide-react";
import { useAuthContext } from "./providers/auth-provider";

const commonRoutes = [
  { href: "/dashboard", label: "Panel de Control", icon: LayoutDashboard },
  { href: "/tickets", label: "Mis Tickets", icon: ListChecks },
];

const adminRoutes = [
   { href: "/admin/dashboard", label: "Panel Admin", icon: ShieldCheck },
   { href: "/admin/tickets", label: "Todos los Tickets", icon: Users },
];


export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const { user } = useAuthContext();

  const routes = user?.isAdmin ? [...commonRoutes, ...adminRoutes.filter(r => r.href.startsWith('/admin'))] : commonRoutes.filter(r => !r.href.startsWith('/admin'));
  
  if (user?.isAdmin && pathname.startsWith('/admin')) {
    // Show admin routes first if in admin section
    const currentRoutes = adminRoutes.map(route => ({
      ...route,
      isActive: pathname === route.href || (route.href !== "/admin/dashboard" && pathname.startsWith(route.href))
    }));
     const appRoutes = commonRoutes.map(route => ({
        ...route,
        isActive: pathname === route.href || (route.href !== "/dashboard" && pathname.startsWith(route.href))
     }));
    return (
         <nav
            className={cn("flex flex-col space-y-2", className)}
            {...props}
        >
            {currentRoutes.map((route) => (
                <Link
                key={route.href}
                href={route.href}
                className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    route.isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : ""
                )}
                >
                <route.icon className="h-5 w-5" />
                {route.label}
                </Link>
            ))}
            <hr className="my-2 border-sidebar-border" />
             {appRoutes.map((route) => (
                <Link
                key={route.href}
                href={route.href}
                className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    route.isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : ""
                )}
                >
                <route.icon className="h-5 w-5" />
                {route.label}
                </Link>
            ))}
        </nav>
    )
  }


  return (
    <nav
      className={cn("flex flex-col space-y-2", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            (pathname === route.href || (route.href !== "/dashboard" && route.href !== "/admin/dashboard" && pathname.startsWith(route.href))) ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : ""
          )}
        >
          <route.icon className="h-5 w-5" />
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
