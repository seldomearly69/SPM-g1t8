"use client";

import { cn } from "@/lib/utils";
import { userAuthSchema } from "@/lib/validations/auth";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userAuthSchema>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  async function onSubmit(data: FormData) {
    console.log("data", data);
    setIsLoading(true);

    const signInResult = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: searchParams?.get("callbackUrl") || "/dashboard",
    });

    setIsLoading(false);

    if (signInResult?.ok) {
      router.push(signInResult.url || "/dashboard");
      console.log("Sign in success:", signInResult.url);
    } else {
      // Set error for password field
      setError("password", {
        type: "manual",
        message: "Invalid email or password",
      });
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="johndoe@example.com"
              type="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              {...register("password")}
              required
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            onClick={() => console.log(errors)}
            type="submit"
            disabled={isLoading}
          >
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2">Or continue with</span>
        </div>
      </div>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() => {
          setIsGitHubLoading(true);
          signIn("github", { callbackUrl: "/dashboard" });
        }}
        disabled={isLoading || isGitHubLoading}
      >
        Github
      </button>
    </div>
  );
}
