"use client"

import { useState, useEffect } from "react"
// import { Calendar } from "@/components/ui/calendar"
// import { Badge } from "@/components/ui/badge"

// Mock data - replace with actual API call
const mockSchedule = [
  { date: "2023-05-01", type: "office" },
  { date: "2023-05-02", type: "wfh" },
  { date: "2023-05-03", type: "office" },
  { date: "2023-05-04", type: "wfh" },
  { date: "2023-05-05", type: "office" },
]

export default function MySchedulePage() {
  const [schedule, setSchedule] = useState(mockSchedule)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    // TODO: Fetch actual schedule data from API
    // setSchedule(await fetchSchedule())
  }, [])

  const getDateContent = (date: Date) => {
    const scheduleItem = schedule.find(item => item.date === date.toISOString().split('T')[0])
    // if (scheduleItem) {
    //   return (
        // <Badge variant={scheduleItem.type === "wfh" ? "secondary" : "default"}>
        //   {scheduleItem.type === "wfh" ? "WFH" : "Office"}
        // </Badge>
    //   )
    // }
    return null
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Schedule</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          {/* <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            components={{
              DayContent: ({ date }) => (
                <>
                  {date.getDate()}
                  {getDateContent(date)}
                </>
              ),
            }}
          /> */}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Schedule Details</h3>
          {selectedDate && (
            <div>
              <p>Selected Date: {selectedDate.toDateString()}</p>
              {getDateContent(selectedDate) ? (
                <p>Work Type: {getDateContent(selectedDate)}</p>
              ) : (
                <p>No schedule information available for this date.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}