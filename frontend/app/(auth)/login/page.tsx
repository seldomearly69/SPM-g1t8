"use client";

import Link from "next/link";
import { UserAuthForm } from "@/components/user-auth-form";
import { motion } from "framer-motion";

export default function LoginPage() {
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      x: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-gray-200">
      <div className="container flex-grow flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[600px] space-y-12"
        >
          <div className="flex flex-col space-y-8 text-center">
            <Link href="/" className="mx-auto">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src="/assets/images/logo.png"
                alt="FlexiWork Logo"
                width={200}
                height={200}
                className="cursor-pointer p-0 m-0"
              />
            </Link>
            <motion.h1
              variants={container}
              initial="hidden"
              animate="visible"
              className="text-6xl font-semibold tracking-light"
            >
              {Array.from("Welcome back").map((letter, index) => (
                <motion.span key={index} variants={child}>
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p
              variants={container}
              initial="hidden"
              animate="visible"
              className="text-2xl text-muted-foreground"
            >
              {Array.from("Enter your email to sign in to your account").map(
                (letter, index) => (
                  <motion.span key={index} variants={child}>
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                )
              )}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="scale-110"
          >
            <UserAuthForm />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
