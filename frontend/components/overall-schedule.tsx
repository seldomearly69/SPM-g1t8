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
import { DaySchedule, EventType } from "@/types";
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
import { Skeleton, SkeletonTable } from "./ui/skeleton";
import { ChartData } from "@/types";

export default function OverallSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [selectedDialogDate, setSelectedDialogDate] = useState<Date | null>(
    null
  );
  const [dialogData, setDialogData] = useState<DaySchedule[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(new Date())
  );
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDialogOpen = async (open: boolean) => {
    if (open && selectedDialogDate) {
      try {
        setIsLoading(true);
        const data = await getOverallSchedule(
          currentMonth.getMonth() + 1,
          currentMonth.getFullYear(),
          selectedDialogDate.getDate()
        );
        setDialogData(data.data.overallSchedule.overallSchedule);

        const chartData = data.data.overallSchedule.overallSchedule.map(
          (schedule: DaySchedule) => {
            return {
              type: schedule.type,
              office: schedule.availableCount.office,
              wfh: schedule.availableCount.wfh,
            };
          }
        );
        setChartData(chartData);
        setIsLoading(false);
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
                    {isLoading ? (
                      <>
                        <Skeleton className="w-[250px] h-6" />
                      </>
                    ) : (
                      <>
                        Staff Availability for{" "}
                        {selectedDialogDate?.toLocaleDateString()}
                      </>
                    )}
                  </DialogTitle>
                  <DialogDescription>
                    {isLoading ? (
                      <Skeleton className="w-[250px] h-6" />
                    ) : (
                      <>Pending requests are included in the availability</>
                    )}
                  </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[calc(90vh-100px)] px-4 sm:px-0 ">
                  {isLoading ? (
                    <Skeleton className="max-w-[500px] mx-auto h-60" />
                  ) : (
                    <AvailabilityChartArea
                      chartData={chartData.length > 0 ? chartData : []}
                    />
                  )}
                  {isLoading ? (
                    <SkeletonTable rows={7} />
                  ) : (
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
                  )}
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
