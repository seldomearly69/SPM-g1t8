"use client"

import { DefaultMonthlyEventItem, MonthlyBody, MonthlyCalendar, MonthlyDay, MonthlyNav } from "@/components/monthly-calendar"
import { getOwnSchedule } from "@/service/schedule"
import { EventType } from "@/types"
import {  startOfMonth, subHours } from "date-fns"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";



// Mock data - replace with actual API call
const mockSchedule = [
  { date: "2024-09-01", availability: "office" , type: "Full", is_pending: true},
  { date: subHours(new Date(), 2), availability: "wfh" , type: "AM", is_pending: false},
  { date: new Date(), availability: "office" , type: "AM", is_pending: false},
  { date: new Date("2024-05-04"), availability: "wfh" , type: "AM", is_pending: false},
  { date: new Date("2024-05-05"), availability: "office" , type: "AM", is_pending: false},
  { date: new Date("2024-05-06"), availability: "wfh" , type: "AM", is_pending: false},
  { date: new Date("2023-05-07"), availability: "office" , type: "AM", is_pending: false},
  { date: new Date("2023-05-08"), availability: "wfh" , type: "AM", is_pending: false},
  { date: new Date("2023-05-09"), availability: "office" , type: "AM", is_pending: false},
  { date: new Date("2023-05-10"), availability: "wfh" , type: "AM", is_pending: false},
]

export default function MySchedulePage() {
  
  const [schedule, setSchedule] = useState(mockSchedule)
  
  const [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(new Date())
  );


  useEffect(() => {
    const fetchSchedule = async () => {
      const data = await getOwnSchedule(currentMonth.getMonth() + 1, currentMonth.getFullYear(), 130002);
      console.log(data.data.ownSchedule.schedule)
      setSchedule(data.data.ownSchedule.schedule)
    };
    fetchSchedule();
  }, [currentMonth])

 

  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="max-w-6xl mx-auto px-2"
  >
    <motion.h2
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="text-2xl font-bold mb-6"
    >
      My Schedule
    </motion.h2>

    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full"
    >
      <Card>
          <CardHeader></CardHeader>
          <CardContent>
        <MonthlyCalendar
          currentMonth={currentMonth}
          onCurrentMonthChange={setCurrentMonth}
        >
            <MonthlyNav/>
          <MonthlyBody events={schedule} >
          
            <MonthlyDay<EventType>
              renderDay={data =>
                data.map((item, index) => (
                  <DefaultMonthlyEventItem
                    key={index}
                    availability={item.availability}
                    date={item.date}
                    type={item.type}
                    is_pending={item.is_pending}
                  />
                ))
          }
          />
        </MonthlyBody>
        
        </MonthlyCalendar>
        </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
} 
