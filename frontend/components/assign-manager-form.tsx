"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "./ui/label";
import { Select, SelectTrigger, SelectValue } from "./ui/select";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { assignManagerSchema } from "@/lib/validations/application";


export default function AssignManagerForm() {

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(assignManagerSchema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <div className="flex flex-col justify-between order-2">
      <div className="space-y-6">
        <div>
          <Label>Manager</Label>
          <Select {...register("manager")}>
            <SelectTrigger>
              <SelectValue placeholder="Select a manager" />
            </SelectTrigger>
          </Select>
        </div>
        <div>
          <Button type="submit">Send Assignment Request</Button>
        </div>
      </div>
    </div>
  </form>
  );
}
