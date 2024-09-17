"use client";

import { useState } from "react";
import LoggedInLandingPage from "@/components/LoggedInLandingPage";
import LoggedOutLandingPage from "@/components/LoggedOutLandingPage";
import Link from "next/link";

export default function LandingPage() {
  // Simulate logged-in state using a static boolean
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>{isLoggedIn ? <LoggedInLandingPage /> : <LoggedOutLandingPage />}</div>
  );
}
