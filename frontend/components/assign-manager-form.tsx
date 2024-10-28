"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { assignManagerSchema } from "@/lib/validations/application";
import { useEffect, useState } from "react";
import { getManagerList } from "@/service/schedule";
import { User } from "@/types";
import { toast } from "@/hooks/use-toast";
import {
  getTransferOptions,
  requestForTransfer,
} from "@/service/transfer_manager";
import { Textarea } from "./ui/textarea";

type FormData = z.infer<typeof assignManagerSchema>;

export default function AssignManagerForm({
  user,
  employeeRequests,
  setIsDialogOpen,
}: {
  user: User;
  employeeRequests: any[];
  setIsDialogOpen: (open: boolean) => void;
}) {
  const [managerList, setManagerList] = useState<any[]>([]);
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

  const onSubmit = async (data: any) => {
    console.log(employeeRequests);
    if (employeeRequests.some((request) => request.status === "pending")) {
      toast({
        title: "Error",
        description:
          "Please settle any outstanding leaves before requesting a manager change.", // Display the error message for each field
        variant: "destructive",
      });
    } else {
      const res = await requestForTransfer(
        "need a breakkkkkk",
        user.staffId,
        data.manager
      );

      console.log(res);
      if (res.data.requestForTransfer.success) {
        setIsDialogOpen(false);
        toast({
          title: "Success",
          description: res.data.requestForTransfer.message,
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: res.data.requestForTransfer.message,
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    getTransferOptions(user.staffId).then((data) => {
      console.log(data);

      setManagerList(data.data.transferOptions);
    });
  }, []);

  return (
    <>
      {showSuccessPopup ? (
        <div>Request Sent!</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col justify-between order-2">
            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="manager"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Manager
                </Label>
                <Controller
                  control={control}
                  name="manager"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {managerList.map((manager) => (
                            <SelectItem
                              key={manager.staffId}
                              value={manager.staffId.toString()}
                            >
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
                <Label
                  htmlFor="reason"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Reason
                </Label>
                <Textarea id="reason" {...register("reason")} />
              </div>
              <div>
                <Button type="submit">Send Assignment Request</Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
