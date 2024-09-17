import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/user-auth-form";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="container flex-grow flex items-center justify-center">
        <div className="w-full max-w-[450px] space-y-8">
          <div className="flex flex-col space-y-4 text-center">
            <Link href="/" className="mx-auto">
              <img
                src="/assets/images/logo.png"
                alt="FlexiWork Logo"
                width={200}
                height={200}
                className="cursor-pointer p-0 m-0"
              />
            </Link>
            <h1 className="text-4xl font-semibold tracking-light">
              Welcome back
            </h1>
            <p className="text-lg text-muted-foreground">
              Enter your email to sign in to your account
            </p>
          </div>
          <UserAuthForm />
          <p className="text-lg">
            <Link href="/register" className="text-lg">
              Don't have an account? Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
