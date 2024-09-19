"use client";

import { SidebarNavItem } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Icons } from "@/components/icons"

interface DashboardNavProps {
  items: SidebarNavItem[];
}

export function DashboardNav({ items }: DashboardNavProps) {
  const path = usePathname();

  return (
    <nav className="grid items-start gap-3 pl-4 border-r-2 border-gray-300 pr-4">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"]

        const isActive = item.href === path;
        return (
          item.href && (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={item.href}>
                <span
                  className={cn(
                    "group flex items-center rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 ease-in-out",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-accent hover:text-accent-foreground",
                    "border-l-4",
                    isActive ? "border-primary" : "border-transparent"
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
