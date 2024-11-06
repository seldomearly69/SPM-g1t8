"use client";

import {
  MonthlyBody,
  MonthlyCalendar,
  MonthlyDay,
  MonthlyNav,
  TeamMonthlyEventItem,
} from "@/components/monthly-calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { availability_columns } from "@/components/columns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getTeamDetails, getTeamSchedule } from "@/service/schedule";
import { DaySchedule, type TeamSchedule, User } from "@/types";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { AvailabilityChartArea } from "./availability-chart-area";

interface TeamScheduleProps {
  user: User;
  _managerList: User[];
}

export default function TeamSchedule({
  user,
  _managerList,
}: TeamScheduleProps) {
  const [teamSchedule, setTeamSchedule] = useState<TeamSchedule>({
    reportingManagerId: 0,
    teamCount: 0,
    teamSchedule: [],
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDialogDate, setSelectedDialogDate] = useState<Date | null>(
    null
  );
  const [chartData, setChartData] = useState<any[]>([]);
  const [dialogData, setDialogData] = useState<DaySchedule[]>([]);
  const [managerList] = useState<User[]>(_managerList);
  const [selectedManager, setSelectedManager] = useState<number>(0);


  useEffect(() => {
    const fetchSchedule = async () => {
      let managerId: number;
      if (user.position === "Director") {
        // If director has manager under him
        if (Array.isArray(managerList) && managerList.length > 0) {
          // On initial load, set to the first manager
          if (!selectedManager) {
            managerId = managerList[0]?.staffId;
            setSelectedManager(managerId);
            // On subsequent loads, set managerId to the existing selected manager
          } else {
            managerId = selectedManager;
          }
        } else {
          managerId = user.staffId;
        }
      } else {
        // For managers and staff
        managerId = user.staffId;
      }

      const team_schedule_data = await getTeamSchedule(
        0,
        selectedDate?.getMonth() + 1,
        selectedDate?.getFullYear(),
        managerId
      );
      setTeamSchedule(team_schedule_data.data.teamSchedule);
    };
    fetchSchedule();
  }, [selectedDate, selectedManager]);

  const handleDialogOpen = async (open: boolean) => {
    if (open && selectedDialogDate) {
      try {

        let data;
        if (user.position === "Director") {
          // Get the schedule details of the team
          // Returns name, department, availability, type and status

          if (!selectedManager) {
            data = await getTeamDetails(
              selectedDialogDate?.getDate(),
              selectedDialogDate?.getMonth() + 1,
              selectedDialogDate?.getFullYear(),
              user.staffId
            );
          } else {
            data = await getTeamDetails(
              selectedDialogDate?.getDate(),
              selectedDialogDate?.getMonth() + 1,
              selectedDialogDate?.getFullYear(),
              selectedManager
            );
          }
        } else {
          // Get the schedule details of the team
          // Returns name, department, availability, type and status

          data = await getTeamDetails(
            selectedDialogDate?.getDate(),
            selectedDialogDate?.getMonth() + 1,
            selectedDialogDate?.getFullYear(),
            user.staffId
          );
        }
        setDialogData(data.data.teamSchedule.teamSchedule);

        const chartData = data.data.teamSchedule.teamSchedule.map(
          (schedule: any) => {
            return {
              type: schedule.type,
              office: schedule.availableCount.office,
              wfh: schedule.availableCount.wfh,
            };
          }
        );
        setChartData(chartData);
        // setDialogData(data.data.teamSchedule.teamSchedule[0].availability.concat(data.data.teamSchedule.teamSchedule[1].availability));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        <MonthlyCalendar
          currentMonth={selectedDate || new Date()}
          onCurrentMonthChange={setSelectedDate}
        >
          <div className="ml-auto flex w-full space-x-5 sm:justify-end">
            {user.position === "Director" && managerList.length > 0 && (
              <Select
                onValueChange={(value) =>
                  setSelectedManager(parseInt(value, 10))
                }
                defaultValue={managerList[0]?.staffId.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a Team" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {managerList.map((manager) => (
                      <SelectItem
                        key={manager.staffId}
                        value={manager.staffId.toString()}
                      >
                        {`${manager.position} - ${manager.name} - ${manager.staffId}`}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            <MonthlyNav />
          </div>
          <MonthlyBody events={teamSchedule.teamSchedule} requests={[]}>
            <Dialog onOpenChange={handleDialogOpen}>
              <DialogTrigger>
                <MonthlyDay<DaySchedule>
                  onDateClick={(date) => setSelectedDialogDate(date)}
                  renderDay={(data) => (
                    <>
                      {data.map((item) => (
                        <TeamMonthlyEventItem
                          key={`${item.date}-${item.type}`}
                          availability={`${
                            item.availableCount?.office || 0
                          } / ${teamSchedule.teamCount || 0}`}
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
