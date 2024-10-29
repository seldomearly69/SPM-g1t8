import { User } from "next-auth"
import { JWT } from "next-auth/jwt"



declare module "next-auth/jwt" {
  interface JWT {
    staffId: number
    name: string
    email: string
    role: number
    position: string
    reportingManager: number
    awayManager: number
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      staffId: number
      name: string
      email: string
      role: number
      position: string
      reportingManager: number
      awayManager: number
    }
  }

  interface User {
    staff_id: number
    name: string
    email: string
    role: number
    position: string
    reporting_manager: number
    away_manager: number
  }
}
