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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { availability_columns } from "@/components/columns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  getManagerList,
  getTeamDetails,
  getTeamSchedule,
} from "@/service/schedule";
import { Availability, EventType, User } from "@/types";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AvailabilityChartArea } from "./availability-chart-area";

const mockSchedule2 = [
  { date: new Date("2024-09-01"), availableCount: 3, type: "AM" },
  { date: new Date("2024-09-01"), availableCount: 4, type: "PM" },
  { date: new Date("2024-09-01"), availableCount: 5, type: "Full" },
  { date: new Date("2024-05-04"), availableCount: "wfh", type: "AM" },
  { date: new Date("2024-05-05"), availableCount: "office", type: "AM" },
  { date: new Date("2024-05-06"), availableCount: "wfh", type: "AM" },
  { date: new Date("2023-05-07"), availableCount: "office", type: "AM" },
  { date: new Date("2023-05-08"), availableCount: "wfh", type: "AM" },
  { date: new Date("2023-05-09"), availableCount: "office", type: "AM" },
  { date: new Date("2023-05-10"), availableCount: "wfh", type: "AM" },
];


interface TeamScheduleProps {
  user: User;
  _managerList: User[];
  _teamSchedule: any[];
}

export default function TeamSchedule({ user, _managerList}: TeamScheduleProps) {
  const [teamSchedule, setTeamSchedule] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDialogDate, setSelectedDialogDate] = useState<Date | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [dialogData, setDialogData] = useState<Availability[]>([]);
  const [managerList, setManagerList] = useState<User[]>(_managerList);
  const [selectedManager, setSelectedManager] = useState<number>(0); // Added to store the selected manager's ID
  // const [showCalendar, setShowCalendar] = useState(false); // Added to control the display of the calendar (redundant)
  
  
  useEffect(() => {
    const fetchSchedule = async () => {
      let managerId: number;
      if (user.position === "Director") {
        // If director has manager under him
        if (Array.isArray(managerList) && managerList.length > 0) {
          // On initial load, set to the first manager
          if (!selectedManager) {
            managerId = parseInt(managerList[0]?.staffId, 10)
            setSelectedManager(managerId);
          // On subsequent loads, set managerId to the existing selected manager
          } else {
            managerId = selectedManager
          }
        } else console.error("Manager list is not an array");
        
      } else {
          // For managers and staff
          managerId = parseInt(user.reportingManager, 10)
          const data = await getTeamSchedule (
            0,
            selectedDate?.getMonth() + 1,
            selectedDate?.getFullYear(),
            user.staffId
          );

          console.log(data)
          setSelectedManager(parseInt(user.reportingManager, 10));
          setTeamSchedule(data.data.teamSchedule.teamSchedule);
         
      }
      
      console.log(managerId);
      
      const team_schedule_data = await getTeamSchedule(
        0, 
        selectedDate?.getMonth() + 1, 
        selectedDate?.getFullYear(), 
        managerId
      );
      console.log(team_schedule_data)
      setTeamSchedule(team_schedule_data.data.teamSchedule.teamSchedule)
    };
    fetchSchedule();
  }, [selectedDate, selectedManager]);

  const handleDialogOpen = async (open: boolean) => {
    if (open && selectedDialogDate) {
      try {
        console.log(selectedDialogDate);
        
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
              user.staffId
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
        console.log(data)
        setDialogData(data.data.teamSchedule.teamSchedule)

        const chartData = data.data.teamSchedule.teamSchedule.map((schedule: any) => {
          return {
          type: schedule.type,
          office: schedule.availableCount.office,
          wfh: schedule.availableCount.wfh
        }})
        console.log(chartData)
        setChartData(chartData)
        // setDialogData(data.data.teamSchedule.teamSchedule[0].availability.concat(data.data.teamSchedule.teamSchedule[1].availability));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };


  return (
      <Card>
        <CardHeader>
        </CardHeader>
        <CardContent>
            <MonthlyCalendar
              currentMonth={selectedDate || new Date()}
              onCurrentMonthChange={setSelectedDate}
            >
              <div className="ml-auto flex w-full space-x-5 sm:justify-end">
                  {user.position === "Director" && managerList.length > 0 && 
                  <Select onValueChange={(value) => setSelectedManager(parseInt(value, 10))} defaultValue={managerList[0]?.staffId.toString()}>
                  <SelectTrigger>
                      <SelectValue 
                        placeholder="Select a Team" 
                      />
                    </SelectTrigger>
                                
                    <SelectContent>
                      <SelectGroup>
                      {managerList.map((manager) => (
                        <SelectItem key={manager.staffId} value={manager.staffId.toString()}>
                          {`${manager.position} - ${manager.name} - ${manager.staffId}`}
                        </SelectItem>
                      ))}
                      </SelectGroup>
              
                
                    </SelectContent>
                  </Select>
                
                    
                  
                }
                <MonthlyNav />

              </div>
              <MonthlyBody events={teamSchedule}>
                <Dialog onOpenChange={handleDialogOpen}>
                  <DialogTrigger>
                    <MonthlyDay<EventType>
                      onDateClick={(date) => setSelectedDialogDate(date)}
                      renderDay={(data) =>
                        <ul>
                          {data.map((item) => (
                            <TeamMonthlyEventItem
                              key={`${item.date}-${item.type}`}
                              availability={item.availableCount?.office || 0}
                              type={item.type}
                            />
                          ))}
                        </ul>

                      }
                    />
                  </DialogTrigger>
                  <DialogContent className="w-full max-w-[95vw] h-[90vh] p-0 sm:p-6">
                    <DialogHeader className="p-4 sm:p-0">
                      <DialogTitle>
                        {dialogData ? <></> : <p>Loading...</p>}
                      </DialogTitle>
                    </DialogHeader>
                   
                      <ScrollArea className="h-[calc(90vh-100px)] px-4 sm:px-0 ">
                        <AvailabilityChartArea chartData={chartData.length > 0 ? chartData : []}/>
                        <DataTable
                          columns={availability_columns}
                          data={dialogData.length > 0 ? dialogData[0].availability.concat(dialogData[1].availability) : []}
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
