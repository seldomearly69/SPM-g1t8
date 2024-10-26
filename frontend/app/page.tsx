"use client";

import { useEffect, useState } from "react";
import LoggedInLandingPage from "@/components/LoggedInLandingPage";
import LoggedOutLandingPage from "@/components/LoggedOutLandingPage";

export default function LandingPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch session:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? <LoggedInLandingPage user={user} /> : <LoggedOutLandingPage />}
    </div>
  );
}
