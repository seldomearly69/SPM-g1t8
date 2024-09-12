"use client"

import { useState, useEffect } from "react"
// import { Calendar } from "@/components/ui/calendar"
// import { Badge } from "@/components/ui/badge"
// import { Card } from "@/components/ui/card"

// Mock data - replace with actual API call
const mockTeamSchedule = [
  { date: "2023-05-01", schedules: [
    { name: "Alice", type: "office" },
    { name: "Bob", type: "wfh" },
    { name: "Charlie", type: "office" },
  ]},
  { date: "2023-05-02", schedules: [
    { name: "Alice", type: "wfh" },
    { name: "Bob", type: "office" },
    { name: "Charlie", type: "wfh" },
  ]},
  // ... more dates
]

export default function TeamSchedulePage() {
  const [teamSchedule, setTeamSchedule] = useState(mockTeamSchedule)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    // TODO: Fetch actual team schedule data from API
    // setTeamSchedule(await fetchTeamSchedule())
  }, [])

  const getDateContent = (date: Date) => {
    const scheduleItem = teamSchedule.find(item => item.date === date.toISOString().split('T')[0])
    if (scheduleItem) {
      const wfhCount = scheduleItem.schedules.filter(s => s.type === "wfh").length
      return (
        <Badge variant="outline">
          {wfhCount}/{scheduleItem.schedules.length} WFH
        </Badge>
      )
    }
    return null
  }

  const getSelectedDateSchedule = () => {
    return teamSchedule.find(item => item.date === selectedDate?.toISOString().split('T')[0])
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Team Schedule</h2>
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
          <h3 className="text-xl font-semibold mb-4">Team Details</h3>
          {/* {selectedDate && getSelectedDateSchedule() && (
            <Card className="p-4">
              <h4 className="font-semibold mb-2">{selectedDate.toDateString()}</h4>
              <ul className="space-y-2">
                {getSelectedDateSchedule()?.schedules.map((schedule, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{schedule.name}</span>
                    <Badge variant={schedule.type === "wfh" ? "secondary" : "default"}>
                      {schedule.type === "wfh" ? "WFH" : "Office"}
                    </Badge>
                  </li>
                ))}
              </ul>
            </Card>
          )} */}
          {selectedDate && !getSelectedDateSchedule() && (
            <p>No team schedule information available for this date.</p>
          )}
        </div>
      </div>
    </div>
  )
}