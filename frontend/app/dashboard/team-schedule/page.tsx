"use client"

import { DefaultMonthlyEventItem, MonthlyBody, MonthlyCalendar, MonthlyDay, MonthlyNav } from "@/components/monthly-calendar";
import { useState} from "react"
import { EventType } from "@/types";


const mockSchedule = [
  { date: new Date("2024-09-01"), title: "3/7" , type: "AM"},
  { date: new Date("2024-09-01"), title: "2/7" , type: "PM"},
  { date: new Date("2024-09-01"), title: "4/7" , type: "Full"},
  { date: new Date("2024-05-04"), title: "wfh" , type: "AM"},
  { date: new Date("2024-05-05"), title: "office" , type: "AM"},
  { date: new Date("2024-05-06"), title: "wfh" , type: "AM"},
  { date: new Date("2023-05-07"), title: "office" , type: "AM"},
  { date: new Date("2023-05-08"), title: "wfh" , type: "AM"},
  { date: new Date("2023-05-09"), title: "office" , type: "AM"},
  { date: new Date("2023-05-10"), title: "wfh" , type: "AM"},
]

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
  const [teamSchedule, setTeamSchedule] = useState(mockSchedule)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())






   
  // let [currentMonth, setCurrentMonth] = useState<Date>(
  //   startOfMonth(new Date())
  // );


  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Team Schedule</h2>

        <div>
          <MonthlyCalendar
            currentMonth={selectedDate || new Date()}
            onCurrentMonthChange={setSelectedDate}
          >
            <MonthlyNav/>
            <MonthlyBody
            events={teamSchedule}
           >
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
        <div>
        
        </div>
      </div>

  )
}