"use client"

import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { DefaultMonthlyEventItem, MonthlyBody, MonthlyCalendar, MonthlyDay, MonthlyNav } from "./monthly-calendar";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema } from "@/lib/validations/application";
import { format, isSameDay } from "date-fns";
import { cn, daysInWeek } from "@/lib/utils";
import { z } from "zod";

type FormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function ApplicationForm({ className, ...props }: ApplicationFormProps) {

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(applicationSchema)
  });

  const [date, setDate] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const onError = (errors: any) => {
    console.log(errors);
  };

  useEffect(() => {
    setValue("date", date);
  }, [date]);

    return (
      <form onSubmit={handleSubmit(onSubmit, onError)}>
      <div className="grid grid-cols-2 gap-4">
          <div className="space-y-6">
           
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Label
                htmlFor="type"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                WFH Type
              </Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select WFH Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                  <SelectItem value="full">Full Day</SelectItem>
                </SelectContent>
              </Select>
              )}
            />
            </motion.div>
        
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Label
                htmlFor="reason"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Reason for WFH Request
              </Label>
              <Textarea
                id="reason"
                rows={4}
                required
                {...register("reason")}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
           
              <Input type="file" accept="*" {...register("file", { required: false })} />
              </motion.div>
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
              <MonthlyNav/>
              <MonthlyBody events={[]} className="border-none" >
                <MonthlyDay
                  className={({ date: dayDate }) => cn("h-20 border-none m-0.5 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-400", {
                    "bg-blue-500": date.some(selectedDate => isSameDay(selectedDate, dayDate)),
                  })}
                  onDateClick={day => {
                   
                    console.log( day.toLocaleDateString());
                    
                    setDate(prev => 
                      prev.some(d => isSameDay(d, day))
                        ? prev.filter(d => !isSameDay(d, day))
                        : [...prev, day]
                    )
                  }}
                  renderDay={data =>
                    data.map((item, index) => (
                      <DefaultMonthlyEventItem
                        key={index}
                        title={item.title}
                        date={format(item.date, 'k:mm')}
                      />
                    ))
                  }
                />
              </MonthlyBody>
            </MonthlyCalendar>  
            </div>
          </div>
          </form>
    )
}