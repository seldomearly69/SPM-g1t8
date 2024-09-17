import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/user-auth-form";

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-8 top-8 text-xl"
        )}
      >
        <>Back</>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[450px]">
        <div className="flex flex-col space-y-4 text-center">
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
  );
}
