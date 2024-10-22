"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { assignManagerSchema } from "@/lib/validations/application";
import { useEffect, useState } from "react";
import { getManagerList } from "@/service/schedule";
import { User } from "@/types";

const mockManagerList = [
  {
    staffId: 140894,
    name: "Rahim Khalid",
    position: "Sales Manager"
  },
  {
    staffId: 140008,
    name: "Jacklyn Lee",
    position: "Sales Manager"
  },
  {
    staffId: 140103,
    name: "Sophia Toh",
    position: "Sales Manager"
  },
  {
    staffId: 140879,
    name: "Siti Abdullah",
    position: "Sales Manager"
  },
  {
    staffId: 140944,
    name: "Yee Lim",
    position: "Sales Manager"
  }
]

type FormData = z.infer<typeof assignManagerSchema>;

export default function AssignManagerForm() {
  const [managerList, setManagerList] = useState<any[]>(mockManagerList);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const {
    control,
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
    setShowSuccessPopup(true)
  };



  return (
    <>
      {showSuccessPopup 
      ? <div>Request Sent!</div> 
      :
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col justify-between order-2">
            <div className="space-y-6">
              <div>
                <Label 
                  htmlFor="manager" 
                  className="block mb-2 text-sm font-medium text-gray-700">Manager</Label>
                <Controller
                  control={control}
                  name="manager"  
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a manager" />
                      </SelectTrigger>
                      <SelectContent>
                      <SelectGroup>
                        {managerList.map((manager) => (
                          <SelectItem key={manager.staffId} value={manager.staffId.toString()}>
                            {`${manager.position} - ${manager.name} - ${manager.staffId}`}
                          </SelectItem>
                        ))}
                          </SelectGroup>
                        
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Button type="submit">Send Assignment Request</Button>
              </div>
            </div>
          </div>
         </form>
      }
    </>
      
  );
}
