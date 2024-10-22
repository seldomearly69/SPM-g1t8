"use client"

import { useEffect, useState } from "react";
import { DefaultMonthlyEventItem, MonthlyBody, MonthlyCalendar, MonthlyDay, MonthlyNav } from "./monthly-calendar";
import { Card, CardContent, CardHeader } from "./ui/card";
import { EventType, User } from "@/types"
import { startOfMonth, subHours } from "date-fns";
import { getLeaves, getOwnSchedule } from "@/service/schedule";

// Mock data - replace with actual API call
const mockSchedule = [
    { date: "2024-09-01", availability: "office" , type: "Full", isPending: true},
    { date: subHours(new Date(), 2), availability: "wfh" , type: "AM", isPending: false},
    { date: new Date(), availability: "office" , type: "AM", isPending: false},
    { date: new Date("2024-05-04"), availability: "wfh" , type: "AM", isPending: false},
    { date: new Date("2024-05-05"), availability: "office" , type: "AM", isPending: false},
    { date: new Date("2024-05-06"), availability: "wfh" , type: "AM", isPending: false},
    { date: new Date("2023-05-07"), availability: "office" , type: "AM", isPending: false},
    { date: new Date("2023-05-08"), availability: "wfh" , type: "AM", isPending: false},
    { date: new Date("2023-05-09"), availability: "office" , type: "AM", isPending: false},
    { date: new Date("2023-05-10"), availability: "wfh" , type: "AM", isPending: false},
  ]

interface MyScheduleProps {
    user: User;
}
  

export default function MySchedule({user}: MyScheduleProps) {
    const [schedule, setSchedule] = useState(mockSchedule)
    const [currentMonth, setCurrentMonth] = useState<Date>(
        startOfMonth(new Date())
    );

    useEffect(() => {
        const fetchSchedule = async () => {

            // Get the schedule of the user by passing in month, year and user's staffId
            const data = await getOwnSchedule(currentMonth.getMonth() + 1, currentMonth.getFullYear(), user.staffId);
            console.log(data);
            const leaves = await getLeaves(currentMonth.getMonth() + 1, currentMonth.getFullYear(), user.staffId);
            console.log(leaves);
            setSchedule(data.data.ownSchedule.schedule.concat(leaves.data.ownLeaves))
        };
        fetchSchedule();
      }, [currentMonth])
    
    return (
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
                        onDateClick={() => {}}
                        renderDay={data =>
                            <ul>
                                {data.map((item, index) => (
                                  
                                <DefaultMonthlyEventItem
                                key={index}
                                availability={item.availability || ""}
                                date={item.date}
                                type={item.type}
                                isPending={item.is_pending}
                                />
                                ))}
                            </ul>
                        }
                    />
                    </MonthlyBody>
                
                </MonthlyCalendar>
            </CardContent>
        </Card>
    )
}

