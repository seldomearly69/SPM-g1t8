import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  console.log("session: - ", session);
  return session?.user;
}
