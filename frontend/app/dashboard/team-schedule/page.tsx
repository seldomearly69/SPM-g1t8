"use client";

import { DefaultMonthlyEventItem, MonthlyBody, MonthlyCalendar, MonthlyDay, MonthlyNav } from "@/components/monthly-calendar";
import { useState} from "react"
import { EventType } from "@/types";
import { motion } from "framer-motion";

const mockSchedule = [
  { date: new Date("2024-09-01"), title: "3/7", type: "AM" },
  { date: new Date("2024-09-01"), title: "2/7", type: "PM" },
  { date: new Date("2024-09-01"), title: "4/7", type: "Full" },
  { date: new Date("2024-05-04"), title: "wfh", type: "AM" },
  { date: new Date("2024-05-05"), title: "office", type: "AM" },
  { date: new Date("2024-05-06"), title: "wfh", type: "AM" },
  { date: new Date("2023-05-07"), title: "office", type: "AM" },
  { date: new Date("2023-05-08"), title: "wfh", type: "AM" },
  { date: new Date("2023-05-09"), title: "office", type: "AM" },
  { date: new Date("2023-05-10"), title: "wfh", type: "AM" },
];

// const mockAvailability = [
//   { employee_name: "John Doe", department: "Engineering", availability: "Office", type: "AM", is_pending: false },
//   { employee_name: "Jane Smith", department: "Marketing", availability: "Office", type: "AM", is_pending: false },
//   { employee_name: "Alice Johnson", department: "Sales", availability: "Office", type: "AM", is_pending: false },
//   { employee_name: "Bob Brown", department: "Engineering", availability: "Office", type: "AM", is_pending: false },
//   { employee_name: "Charlie Davis", department: "Marketing", availability: "Office", type: "AM", is_pending: false },
//   { employee_name: "Diana White", department: "Sales", availability: "Office", type: "AM", is_pending:true },
//   { employee_name: "Eve Green", department: "Engineering", availability: "Office", type: "AM", is_pending: false },    
// ]


export default function TeamSchedulePage() {
  const [teamSchedule, setTeamSchedule] = useState(mockSchedule);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );






   
  // let [currentMonth, setCurrentMonth] = useState<Date>(
  //   startOfMonth(new Date())
  // );

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
        Team Schedule
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full"
      >
        <MonthlyCalendar
          currentMonth={selectedDate || new Date()}
          onCurrentMonthChange={setSelectedDate}
        >
          <MonthlyNav />
          <MonthlyBody events={teamSchedule}>
            <MonthlyDay<EventType>
              renderDay={(data) =>
                data.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <DefaultMonthlyEventItem
                      title={item.title}
                      date={item.date}
                      type={item.type}
                    />
                  </motion.div>
                ))
              }
            />
          </MonthlyBody>
        </MonthlyCalendar>
      </motion.div>
      <div></div>
    </motion.div>
  );
}
