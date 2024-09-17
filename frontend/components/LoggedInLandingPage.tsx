import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function LoggedInLandingPage() {
  const user = useState("Alexander");

  return (
    <div className="bg-gradient-to-br from-gray-100 via-blue-50 to-gray-200 min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl"
      >
        <h2 className="text-6xl font-extrabold mb-8">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-gray-700">
            Welcome back,
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-700 via-indigo-600 to-blue-600">
            {user[0]}
          </span>
        </h2>
        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-blue-700 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-blue-800 transition-colors"
            >
              My Schedule
            </motion.button>
          </Link>
          <Link href="/profile">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-indigo-700 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-indigo-800 transition-colors"
            >
              Manage Arrangements
            </motion.button>
          </Link>
          <Link href="/schedule">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gray-700 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-gray-800 transition-colors"
            >
              Apply for WFH
            </motion.button>
          </Link>
        </motion.div>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link href="/logout">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-red-600 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
