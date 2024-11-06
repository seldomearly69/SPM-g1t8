"use client";

import { useEffect, useState } from "react";
import {
  DefaultMonthlyEventItem,
  MonthlyBody,
  MonthlyCalendar,
  MonthlyDay,
  MonthlyNav,
} from "./monthly-calendar";
import { Card, CardContent, CardHeader } from "./ui/card";
import { EventType, User } from "@/types";
import { startOfMonth } from "date-fns";
import { getLeaves, getOwnSchedule } from "@/service/schedule";


interface MyScheduleProps {
  user: User;
}

export default function MySchedule({ user }: MyScheduleProps) {
  const [schedule, setSchedule] = useState<EventType[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(new Date())
  );

  useEffect(() => {
    const fetchSchedule = async () => {
      // Get the schedule of the user by passing in month, year and user's staffId
      const data = await getOwnSchedule(
        currentMonth.getMonth() + 1,
        currentMonth.getFullYear(),
        user.staffId
      );
      const leaves = await getLeaves(
        currentMonth.getMonth() + 1,
        currentMonth.getFullYear(),
        user.staffId
      );
      setSchedule(data.data.ownSchedule.schedule.concat(leaves.data.ownLeaves));
    };
    fetchSchedule();
  }, [currentMonth]);

  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        <MonthlyCalendar
          currentMonth={currentMonth}
          onCurrentMonthChange={setCurrentMonth}
        >
          <MonthlyNav />
          <MonthlyBody events={schedule} requests={[]}>
            <MonthlyDay<EventType>
              onDateClick={() => {}}
              renderDay={(data) => (
                <>
                  {data.map((item, index) => (
                    <DefaultMonthlyEventItem
                      key={index}
                      availability={item.availability || ""}
                      date={item.date}
                      type={item.type}
                      isPending={item.is_pending}
                    />
                  ))}
                </>
              )}
            />
          </MonthlyBody>
        </MonthlyCalendar>
      </CardContent>
    </Card>
  );
}
