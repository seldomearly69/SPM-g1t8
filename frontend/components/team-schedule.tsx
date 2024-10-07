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
import { mockSchedule } from "@/mock-schedule";

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
}

export default function TeamSchedule({ user }: TeamScheduleProps) {
  const [teamSchedule, setTeamSchedule] = useState(mockSchedule2);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDialogDate, setSelectedDialogDate] = useState<Date | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [dialogData, setDialogData] = useState<Availability[]>([]);
  const [managerList, setManagerList] = useState<User[]>([]);
  const [selectedManager, setSelectedManager] = useState<number>(0); // Added to store the selected manager's ID
  // const [showCalendar, setShowCalendar] = useState(false); // Added to control the display of the calendar (redundant)

  useEffect(() => {
    const fetchSchedule = async () => {
      if (user.position === "Director") {

        // Get all managers that fall under that director
        const data = await getManagerList(user.staffId);
        const managerList = data.data.managerList.managerList;

        if (Array.isArray(managerList)) {
          setManagerList(managerList);
          console.log(managerList)
          console.log(managerList[0]?.staffId)
          // Get team schedule, by default will be the first manager's team
          const teamSchedule = await getTeamSchedule(0, selectedDate?.getMonth() + 1, selectedDate?.getFullYear(), managerList[0]?.staffId ?? user.staffId);
          console.log(teamSchedule)
          setSelectedManager(parseInt(managerList[0]?.staffId, 10));
          setTeamSchedule(teamSchedule.data.teamSchedule.teamSchedule)

        } else console.error("Manager list is not an array");
        
      } else {
        // Get the schedule of the user's team
        // Returns availableCount and type for each day
          const data = await getTeamSchedule (
            0,
            selectedDate?.getMonth() + 1,
            selectedDate?.getFullYear(),
            user.staffId
          );

          console.log(data)
          setSelectedManager(parseInt(user.reportingManager, 10));
          setTeamSchedule(data.data.teamSchedule.teamSchedule);
          // Redundant, react will auto re-render
          // setShowCalendar(true); 
      }
    };
    fetchSchedule();
  }, [selectedDate]);

  const handleDialogOpen = async (open: boolean) => {
    if (open && selectedDialogDate) {
      try {
        console.log(selectedDialogDate);
        
        let data;
        if (user.position === "Director") {
          // Get the schedule details of the team
          // Returns name, department, availability, type and status
          data = await getTeamDetails(
            selectedDialogDate?.getDate(),
            selectedDialogDate?.getMonth() + 1,
            selectedDialogDate?.getFullYear(),
            selectedManager
          );
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
          wfh: schedule.availableCount.home
        }})
        console.log(chartData)
        setChartData(chartData)
        // setDialogData(data.data.teamSchedule.teamSchedule[0].availability.concat(data.data.teamSchedule.teamSchedule[1].availability));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const handleManagerChange = async (managerId: string ) => {
    console.log(managerId)
    // Update the selected manager's ID
    setSelectedManager(parseInt(managerId, 10)); 

    // Assuming there's a method to fetch team schedule based on manager ID // There is, it's getTeamSchedule
    const data = await getTeamSchedule(
      0,
      selectedDate?.getMonth() + 1,
      selectedDate?.getFullYear(),
      parseInt(managerId, 10)
    );
    setTeamSchedule(data.data.teamSchedule.teamSchedule);

    // Display the calendar after the user select the team to view // Redundant, react will auto re-render
    // setShowCalendar(true); 
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
                  <Select onValueChange={handleManagerChange} defaultValue={managerList[0]?.staffId.toString()}>
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
                        data.map((item) => (
                          <TeamMonthlyEventItem
                            key={`${item.date}-${item.type}`}
                            availability={item.availableCount?.office || 0}
                            type={item.type}
                          />
                        ))
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
