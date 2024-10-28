"use client";

import { useEffect, useState } from "react";
import {
  MonthlyBody,
  MonthlyCalendar,
  MonthlyDay,
  MonthlyNav,
  TeamMonthlyEventItem,
} from "./monthly-calendar";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Availability, EventType, User } from "@/types";
import { startOfMonth } from "date-fns";
import { getOverallAvailability, getOverallSchedule } from "@/service/schedule";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { DataTable } from "./data-table";
import { availability_columns } from "./columns";
import { AvailabilityChartArea } from "./availability-chart-area";

interface MyScheduleProps {
  user: User;
}

export default function OverallSchedule({ user }: MyScheduleProps) {
  const [schedule, setSchedule] = useState([]);
  const [selectedDialogDate, setSelectedDialogDate] = useState<Date | null>(
    null
  );
  const [dialogData, setDialogData] = useState<Availability[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(new Date())
  );
  const [chartData, setChartData] = useState<any[]>([]);

  const handleDialogOpen = async (open: boolean) => {
    if (open && selectedDialogDate) {
      try {
        const data = await getOverallSchedule(
          currentMonth.getMonth() + 1,
          currentMonth.getFullYear(),
          selectedDialogDate.getDate()
        );
        setDialogData(data.data.overallSchedule.overallSchedule);

        const chartData = data.data.overallSchedule.overallSchedule.map(
          (schedule: any) => {
            return {
              type: schedule.type,
              office: schedule.availableCount.office,
              wfh: schedule.availableCount.wfh,
            };
          }
        );
        console.log(chartData);
        setChartData(chartData);
        // setDialogData(data.data.teamSchedule.teamSchedule[0].availability.concat(data.data.teamSchedule.teamSchedule[1].availability));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      // Get the schedule of the user by passing in month, year and user's staffId
      const data = await getOverallAvailability(
        currentMonth.getMonth() + 1,
        currentMonth.getFullYear()
      );
      console.log(data.data.overallAvailability.overallAvailability);

      setSchedule(data.data.overallAvailability.overallAvailability);
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
          {/* <div className="ml-auto flex w-full space-x-5 sm:justify-end">
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
          </div> */}
          <MonthlyNav />
          <MonthlyBody events={schedule} requests={[]}>
            <Dialog onOpenChange={handleDialogOpen}>
              <DialogTrigger>
                <MonthlyDay<EventType>
                  onDateClick={(date) => setSelectedDialogDate(date)}
                  renderDay={(data) => (
                    <>
                      {data.map((item) => (
                        <TeamMonthlyEventItem
                          key={`${item.date}-${item.type}`}
                          availability={`${item.availability || 0}`}
                          type={item.type}
                        />
                      ))}
                    </>
                  )}
                />
              </DialogTrigger>
              <DialogContent className="w-full max-w-[95vw] h-[90vh] p-0 sm:p-6">
                <DialogHeader className="p-4 sm:p-0">
                  <DialogTitle>
                    {dialogData ? (
                      <>
                        Staff Availability for{" "}
                        {selectedDialogDate?.toLocaleDateString()}
                      </>
                    ) : (
                      <p>Loading...</p>
                    )}
                  </DialogTitle>
                  <DialogDescription>
                    Pending requests are included in the availability
                  </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[calc(90vh-100px)] px-4 sm:px-0 ">
                  <AvailabilityChartArea
                    chartData={chartData.length > 0 ? chartData : []}
                  />
                  <DataTable
                    columns={availability_columns}
                    data={
                      dialogData.length > 0
                        ? dialogData[0].availability.concat(
                            dialogData[1].availability
                          )
                        : []
                    }
                    hasToolbar={true}
                    sort={false}
                    filterStatus={true}
                    filterType={true}
                    filterAvailability={true}
                    filterDepartment={true}
                  />
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </MonthlyBody>
        </MonthlyCalendar>
      </CardContent>
    </Card>
  );
}
