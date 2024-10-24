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
import { startOfMonth, subHours } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { getOverallSchedule } from "@/service/schedule";

// Mock data - replace with actual API call
const mockSchedule = [
  { date: "2024-09-01", availability: "office", type: "Full", isPending: true },
  {
    date: subHours(new Date(), 2),
    availability: "wfh",
    type: "AM",
    isPending: false,
  },
  { date: new Date(), availability: "office", type: "AM", isPending: false },
  {
    date: new Date("2024-05-04"),
    availability: "wfh",
    type: "AM",
    isPending: false,
  },
  {
    date: new Date("2024-05-05"),
    availability: "office",
    type: "AM",
    isPending: false,
  },
  {
    date: new Date("2024-05-06"),
    availability: "wfh",
    type: "AM",
    isPending: false,
  },
  {
    date: new Date("2023-05-07"),
    availability: "office",
    type: "AM",
    isPending: false,
  },
  {
    date: new Date("2023-05-08"),
    availability: "wfh",
    type: "AM",
    isPending: false,
  },
  {
    date: new Date("2023-05-09"),
    availability: "office",
    type: "AM",
    isPending: false,
  },
  {
    date: new Date("2023-05-10"),
    availability: "wfh",
    type: "AM",
    isPending: false,
  },
];

interface MyScheduleProps {
  user: User;
}

export default function OverallSchedule({ user }: MyScheduleProps) {
  const [schedule, setSchedule] = useState(mockSchedule);

  const [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(new Date())
  );

  useEffect(() => {
    const fetchSchedule = async () => {
      // Get the schedule of the user by passing in month, year and user's staffId
      const data = await getOverallSchedule(
        currentMonth.getMonth() + 1,
        currentMonth.getFullYear()
      );
      console.log(data);
      setSchedule();
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
          <div className="ml-auto flex w-full space-x-5 sm:justify-end">
            {user.position === "Director" && (
              <Select onValueChange={() => {}}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup></SelectGroup>
                </SelectContent>
              </Select>
            )}
            <MonthlyNav />
          </div>
          <MonthlyBody events={schedule} requests={[]}>
            <MonthlyDay<EventType>
              onDateClick={() => {}}
              renderDay={(data) =>
                data.map((item, index) => (
                  <DefaultMonthlyEventItem
                    key={index}
                    availability={item.availability || ""}
                    date={item.date}
                    type={item.type}
                    isPending={item.is_pending}
                  />
                ))
              }
            />
          </MonthlyBody>
        </MonthlyCalendar>
      </CardContent>
    </Card>
  );
}
