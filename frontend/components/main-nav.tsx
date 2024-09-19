"use client"

import { cn } from "@/lib/utils";
import { MainNavItem } from "@/types";
import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserAccountNav } from "./user-account-nav";
import { useSelectedLayoutSegment } from "next/navigation";

interface MainNavProps {
  items?: MainNavItem[];
  children?: React.ReactNode;
}

export function MainNav({ items }: MainNavProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const segment = useSelectedLayoutSegment()
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex gap-6 md:gap-10"
    >
      <Link href="/" className="flex items-center">
        <Image
          src="/assets/images/logo.png"
          alt="FlexiWork Logo"
          width={80}
          height={80}
          className="mr-2 pl-4 pr-2"
        />
        <span className="font-bold text-xl">FlexiWork</span>
      </Link>
      {items?.length ? (
        <nav className="hidden md:flex gap-6 items-center">
          {items?.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                item.href.startsWith(`/${segment}`)
                  ? "text-foreground"
                  : "text-foreground/60",
                item.disabled && "cursor-not-allowed opacity-80"
              )}
            >
              {item.title}
            </Link>
            </motion.div>
          ))}
        </nav>
      ) : null}
      <div className="md:hidden">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-md bg-secondary text-secondary-foreground text-base shadow-sm"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? "Close" : "Menu"}
        </motion.button>
      </div>
      <AnimatePresence>
        {showMobileMenu && items && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full right-0 w-full md:w-auto bg-white shadow-lg rounded-b-md"
          >
            <nav className="flex flex-col p-4">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href || "#"}
                    className="py-2 text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {item.title}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
