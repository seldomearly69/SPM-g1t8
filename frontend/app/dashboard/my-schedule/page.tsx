"use client"

import { DefaultMonthlyEventItem, MonthlyBody, MonthlyCalendar, MonthlyDay, MonthlyNav } from "@/components/monthly-calendar"
import { EventType } from "@/types"
import {  startOfMonth, subHours } from "date-fns"
import { useState, useEffect } from "react"
// import { Calendar } from "@/components/ui/calendar"
// import { Badge } from "@/components/ui/badge"

// Mock data - replace with actual API call
const mockSchedule = [
  { date: new Date("2024-09-01"), title: "office" , type: "Full"},
  { date: subHours(new Date(), 2), title: "wfh" , type: "AM"},
  { date: new Date(), title: "office" , type: "AM"},
  { date: new Date("2024-05-04"), title: "wfh" , type: "AM"},
  { date: new Date("2024-05-05"), title: "office" , type: "AM"},
  { date: new Date("2024-05-06"), title: "wfh" , type: "AM"},
  { date: new Date("2023-05-07"), title: "office" , type: "AM"},
  { date: new Date("2023-05-08"), title: "wfh" , type: "AM"},
  { date: new Date("2023-05-09"), title: "office" , type: "AM"},
  { date: new Date("2023-05-10"), title: "wfh" , type: "AM"},
]

export default function MySchedulePage() {
  
  const [schedule, setSchedule] = useState(mockSchedule)
  
  const [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(new Date())
  );

  useEffect(() => {
    // TODO: Fetch actual schedule data from API
    // setSchedule(await fetchSchedule())
  }, [])

 

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Schedule</h2>
      <div>
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
                    title={item.title}
                    date={item.date}
                    type={item.type}
                  />
                ))
          }
          />
        </MonthlyBody>
        
        </MonthlyCalendar>
    </div>
       
    </div>
  )
} 
