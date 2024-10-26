"use client";

import { SidebarNavItem } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Icons } from "@/components/icons";
import { useEffect, useState } from "react";

interface DashboardNavProps {
  sideBarNav: {
    common: SidebarNavItem[];
    roleSpecific: {
      [key: number]: SidebarNavItem[];
    };
  };
  currentUser: {
    role?: number;
  } | null;
}

export function DashboardNav({ sideBarNav, currentUser }: DashboardNavProps) {
  const path = usePathname();
  const [navItems, setNavItems] = useState<SidebarNavItem[]>([]);

  const roles = sideBarNav.roleSpecific;

  useEffect(() => {
    const items = [...sideBarNav.common];
    if (
      currentUser &&
      currentUser.role !== undefined &&
      roles[currentUser.role]
    ) {
      items.push(...roles[currentUser.role]);
    }
    setNavItems(items);
  }, [sideBarNav, currentUser]);

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
        return (
          item.href && (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={item.disabled ? "#" : item.href}>
                <span
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    path === item.href ? "bg-accent" : "transparent",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </span>
              </Link>
            </motion.div>
          )
        );
      })}
    </nav>
  );
}
