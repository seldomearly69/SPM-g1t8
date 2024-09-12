"use client";

import { postPatchSchema } from "@/lib/validations/post";
import { Post } from "@prisma/client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import EditorJS from "@editorjs/editorjs";
import * as z from "zod";
import { Icons } from "./ui/icons";

interface EditorProps {
  post: Pick<Post, "id" | "title" | "content" | "published" | "createdAt">;
}

type FormData = z.infer<typeof postPatchSchema>;

export function Editor({ post }: EditorProps) {
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(postPatchSchema),
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const ref = useRef<EditorJS>();

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const List = (await import("@editorjs/list")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const body = postPatchSchema.parse(post);

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Type here to write your post...",
        inlineToolbar: true,
        data: body.content,
        tools: {
          header: Header,
          linkTool: LinkTool,
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, [post]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      initializeEditor();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  async function onSubmit(data: FormData) {
    setIsSaving(true);
    const content = await ref.current?.save();
    const response = await fetch(`/api/posts/${post.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        content: content,
      }),
    });

    setIsSaving(false);
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full gap-10">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-10">
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              Back
            </Link>
            <p className="text-sm text-muted-foreground">
              {post.published ? "Published" : "Draft"}
            </p>
          </div>
          <button type="submit" className={cn(buttonVariants())}>
            {isSaving ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <span>Save</span>
            )}
          </button>
        </div>
        <div className="prose prose-stone mx-auto w-[800px] dark:prose-invert">
          <TextareaAutosize
            autoFocus
            id="title"
            defaultValue={post.title}
            placeholder="Post title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold  focus:outline-none"
            {...register("title")}
          ></TextareaAutosize>

          <div id="editor" className="min-h-[500px]"></div>
        </div>
      </div>
    </form>
  );
}
