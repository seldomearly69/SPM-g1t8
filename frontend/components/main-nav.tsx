"use client";

import { cn } from "@/lib/utils";
import { MainNavItem } from "@/types";
import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import { useState } from "react";

interface MainNavProps {
  items?: MainNavItem[];
  children?: React.ReactNode;
}

export function MainNav({ items, children }: MainNavProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  return (
    <div className="flex justify-between items-center w-full py-2">
      <Link href="/" className="flex items-center">
        <Image
          src="/assets/images/logo.png"
          alt="FlexiWork Logo"
          width={80}
          height={80}
          className="mr-2"
        />
        <span className="font-bold text-xl">FlexiWork</span>
      </Link>
      {items?.length ? (
        <nav className="hidden md:flex gap-6 items-center">
          {items?.map((item, index) => (
            <Link
              key={index}
              href={item.href || "#"}
              className={cn(
                "text-lg font-medium hover:text-primary transition-colors"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
      <div className="md:hidden">
        <button
          className="p-2 rounded-md bg-secondary text-secondary-foreground text-base"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? "Close" : "Menu"}
        </button>
      </div>
      {showMobileMenu && items && (
        <div className="absolute top-full right-0 w-full md:w-auto bg-background shadow-lg rounded-b-md">
          <nav className="flex flex-col p-4">
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href || "#"}
                className="py-2 text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
