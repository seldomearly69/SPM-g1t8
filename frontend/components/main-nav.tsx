"use client";

import { cn } from "@/frontend/lib/utils";
import { MainNavItem } from "@/types";
import Link from "next/link";
import * as React from "react";
import { useState } from "react";

interface MainNavProps {
  items?: MainNavItem[];
  children?: React.ReactNode;
}

export function MainNav({ items, children }: MainNavProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/">
        <span className="hidden font-bold sm:inline-bold">Taxonomy</span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex" key={items.length}>
          {items?.map((item, index) => (
            <Link
              href={"#"}
              className={cn("flex items-center text-lg font-medium ")}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? "close" : "logo"}
        <span className="font-bold">Menu</span>
      </button>
      {showMobileMenu && items && "mobilenav"}
    </div>
  );
}
