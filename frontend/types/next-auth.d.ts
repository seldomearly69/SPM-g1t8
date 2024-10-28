import { User } from "next-auth"
import { JWT } from "next-auth/jwt"

type UserId = string

declare module "next-auth/jwt" {
  interface JWT {
    staffId: UserId
    name: string
    email: string
    role: string
    position: string
    reportingManager: string
    awayManager: string
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      staffId: UserId
      name: string
      email: string
      role: string
      position: string
      reportingManager: string
      awayManager: string
    }
  }

  interface User {
    staff_id: UserId
    name: string
    email: string
    role: string
    position: string
    reporting_manager: string
    away_manager: string
  }
}
