"use client";

import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { createRequest } from "@/service/apply";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema } from "@/lib/validations/application";
import { z } from "zod";
import {
  ApplyMonthlyEventItem,
  CustomMonthlyDay,
  MonthlyBody,
  MonthlyCalendar,
  MonthlyNav,
} from "./monthly-calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn, hasMoreThanTwoDays } from "@/lib/utils";
import { isSameDay } from "date-fns";
import { EventType, Request, User } from "@/types";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User;
  requests: any;
}

export default function ApplicationForm({
  user,
  requests,
}: ApplicationFormProps) {
  const { register, handleSubmit, setValue } = useForm<FormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      remarks: "", // Ensure remarks is initialized with an empty string
    },
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [date, setDate] = useState<{ date: string; type: "AM" | "PM" }[]>([]);
  const [statusCode, setStatusCode] = useState<string>("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // Added state for success popup
  const { toast } = useToast();
  const router = useRouter();

  // Submission Logic is here
  const onSubmit = async (data: any) => {
    // Format the date to "YYYY-MM-DDTHH:MM:SS.000Z" before sending to the backend

    // Convert FileList to array or handle it being empty
    const files: File[] = data.file ? Array.from(data.file) : [];


    try {
      const response = await createRequest(
        user.staffId,
        date,
        data.reason,
        data.remarks, // Ensure remarks is being sent over
        files
      );


      if (response.data.createRequest.success) {

        setStatusCode(response.data.createRequest.success);
        setShowSuccessPopup(true); // Show success popup upon successful submission
        setDate([]);
        router.refresh();
      } else {
        console.log("No status code returned from the backend");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      setStatusCode("500");
    }
  };

  const onError = (errors: any) => {
    console.log("Form submission errors:", errors); // Check what validation errors are thrown
    // eslint-disable-next-line
    Object.entries(errors).forEach(([field, error]) => {
      toast({
        title: "Error",
        description: (error as { message: string }).message, // Display the error message for each field
        variant: "destructive",
      });
    });
  };

  const refreshPageAfterSuccess = () => {
    setShowSuccessPopup(false);
    window.location.reload();
  };

  useEffect(() => {
    setValue("date_type", date as [{ date: string; type: "AM" | "PM" }]);

    if (requests) {
      const combinedDates = date.concat(
        requests.map((r: any) => ({ date: r.date, type: r.type }))
      );
      if (combinedDates.length > 0 && hasMoreThanTwoDays(combinedDates)) {
        toast({
          title: "Notice",
          description:
            "You exceeded the maximum number of days allowed for this month",
          variant: "info",
        });
      }
    }
  }, [date]);

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col justify-between order-2">
          <div className="space-y-6 pt-14">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Label
                htmlFor="reason"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Reason <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="reason"
                required
                rows={4}
                {...register("reason", { required: true })}
                placeholder="Please enter your reasons for the WFH request (max 300 words)"
                maxLength={300}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Input
                type="file"
                accept="*"
                {...register("file", { required: false })}
                multiple
              />
            </motion.div>
            {statusCode !== "200" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Label
                  htmlFor="error"
                  className="block mb-2 text-sm font-medium text-red-700"
                >
                  {statusCode}
                </Label>
              </motion.div>
            )}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button type="submit" className="w-full">
              Submit Application
            </Button>
          </motion.div>
        </div>
        <div className="order-1">
          <MonthlyCalendar
            currentMonth={selectedDate || new Date()}
            onCurrentMonthChange={setSelectedDate}
          >
            <MonthlyNav />

            <MonthlyBody
              events={date || []}
              requests={requests.filter((r: Request) => {
                return (
                  r.status === "pending" ||
                  r.status === "approved" ||
                  r.status === "pending_withdrawal"
                );
              })}
              className="border-none"
            >
              <CustomMonthlyDay<EventType>
                className={({ date: dayDate }) =>
                  cn({
                    "bg-primary text-primary-foreground": date?.some((d) =>
                      isSameDay(d.date, dayDate)
                    ),
                  })
                }
                onDateClick={setDate}
                renderDay={(data) => {
                  return (
                    <ul className="flex gap-1 justify-evenly w-full overflow-hidden max-h-36 overflow-y-auto empty:hidden">
                      {data.map((item, index) => (
                        <ApplyMonthlyEventItem
                          key={index}
                          availability={item.availability || ""}
                          date={item.date}
                          type={item.type}
                          isPending={item.is_pending || false}
                        />
                      ))}
                    </ul>
                  );
                }}
              />
            </MonthlyBody>
          </MonthlyCalendar>
        </div>
      </div>
      {showSuccessPopup && (
        <Dialog
          open={showSuccessPopup}
          onOpenChange={() => setShowSuccessPopup(false)}
        >
          <DialogContent className="md:max-w-[425px] text-md">
            <DialogHeader>
              <DialogTitle className="text-lg">
                Application Submitted!
              </DialogTitle>
              <DialogDescription className="text-md">
                Your Application has been submitted and will be reviewed by your
                immediate superior
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() => refreshPageAfterSuccess()}
                className="text-md"
              >
                Okay
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </form>
  );
}
