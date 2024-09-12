"use client";

import { ButtonProps, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icons } from "./ui/icons";

interface PostCreateButtonProps extends ButtonProps {}

export function PostCreateButton({
  className,
  variant,
  ...props
}: PostCreateButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function onClick() {
    setIsLoading(true);

    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: "Untitled Post" }),
    });
    setIsLoading(false);

    const post = await response.json();

    router.refresh();

    router.push(`/editor/${post.id}`);
  }
  return (
    <button
      onClick={onClick}
      className={cn(
        buttonVariants({ variant }),
        { "cursor-not-allowed opacity-60": isLoading },
        className
      )}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        "New Post"
      )}
    </button>
  );
}
