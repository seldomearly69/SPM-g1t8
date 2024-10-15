"use client";

import { motion } from "framer-motion";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { createRequest } from "@/service/apply";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema } from "@/lib/validations/application";
import { z } from "zod";
import { CustomMonthlyDay, DefaultMonthlyEventItem, MonthlyBody, MonthlyCalendar, MonthlyDay, MonthlyNav } from "./monthly-calendar";
import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import { EventType } from "@/types";

type FormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps extends React.HTMLAttributes<HTMLDivElement> {
  user: any;
}

export default function ApplicationForm({
  className,
  user,
  ...props
}: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(applicationSchema),
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [date, setDate] = useState<{date: Date, type: string}[]>([]);
  const [statusCode, setStatusCode] = useState();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // Added state for success popup

  // Submission Logic is here
  const onSubmit = async (data: any) => {
    // Format the date to "YYYY-MM-DDTHH:MM:SS.000Z" before sending to the backend
    const formattedDates = data.date.map((d: {date: Date, type: string}) => {
      
      return {date: format(d.date, "yyyy-MM-dd"), type: d.type}
    });

    // Convert FileList to array or handle it being empty
    const files = data.file ? Array.from(data.file) : [];

    console.log("Form Data Submitted:", { ...data, date: formattedDates });

    try {
      const response = await createRequest(
        user.staffId,
        formattedDates,
        data.reason,
        data.remarks, // Ensure remarks is being sent over
        files
      );

      console.log("Response: ", response);

      if (response.data.createRequest.success) {
        console.log("Status Code:", response.data.createRequest.success);
        setStatusCode(response.data.createRequest.success);
        setShowSuccessPopup(true); // Show success popup upon successful submission
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
  };



  useEffect(() => {
    setValue("date", date);
  }, [date]);

  console.log(date);
  

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Label
              htmlFor="reason"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Reason Title
            </Label>
            <Input
              id="reason"
              type="text"
              required
              {...register("reason")}
              placeholder="Short title for your reason (max 50 words)"
              maxLength={50}
              style={{ width: "100%" }}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Label
              htmlFor="remarks"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Remarks
            </Label>
            <Textarea
              id="remarks"
              rows={4}
              {...register("remarks", { required: true })}
              placeholder="Please enter your remarks for the WFH request (max 300 words)"
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
          {statusCode !== 200 && (
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              Submit Application
            </Button>
          </motion.div>
        </div>
        <div>
          <MonthlyCalendar
            currentMonth={selectedDate || new Date()}
            onCurrentMonthChange={setSelectedDate}
          >
          <MonthlyNav />
            <MonthlyBody events={date || []} className="border-none">
              <CustomMonthlyDay<EventType>
                className={({ date: dayDate }) =>
                    cn(
                    "h-20 border-none m-0.5 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-400",
                    {
                        "bg-blue-500": date?.some(d => isSameDay(d.date, dayDate))
                    })}
                onDateClick={setDate}
                renderDay={data =>
                    data.map((item, index) => (
                        <DefaultMonthlyEventItem
                            key={index}
                            availability={item.availability || ""}
                            date={item.date}
                            type={item.type}
                            isPending={item.is_pending || false}
                        />
                    ))
                }
                />
                
                  
              </MonthlyBody>
            </MonthlyCalendar>
        </div>
      </div>
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-xl font-semibold text-green-600">
              Your application has been submitted successfully!
            </p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
