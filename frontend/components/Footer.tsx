"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full text-center"
          >
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="flex flex-wrap justify-center space-x-4">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-600 text-lg"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 text-lg"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 text-lg"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 text-lg"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500"
        >
          © {new Date().getFullYear()} FlexiWork. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
}
