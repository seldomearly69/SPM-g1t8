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
  getDepartmentSchedule,
  getManagerList,
  getTeamDetails,
  getTeamSchedule,
} from "@/service/schedule";
import { Availability, EventType, User } from "@/types";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const mockSchedule = [
  { date: new Date("2024-09-01"), availableCount: "3/7", type: "AM" },
  { date: new Date("2024-09-01"), availableCount: "2/7", type: "PM" },
  { date: new Date("2024-09-01"), availableCount: "4/7", type: "Full" },
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
  const [teamSchedule, setTeamSchedule] = useState(mockSchedule);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dialogData, setDialogData] = useState<Availability[]>([]);
  const [managerList, setManagerList] = useState<User[]>([]);
  const [selectedManager, setSelectedManager] = useState<number>(0); // Added to store the selected manager's ID
  const [showCalendar, setShowCalendar] = useState(false); // Added to control the display of the calendar

  useEffect(() => {
    const fetchSchedule = async () => {
      if (user.position === "Director") {
        console.log("Retrieved Schedule of My Teams");

        // Get all team members that fall under that director
        console.log(user)
        const data = await getManagerList(user.staff_id);

        const managerList = data.data.managerList.managerList;

        if (Array.isArray(managerList)) {
          setManagerList(managerList);
        } else {
          console.error("Manager list is not an array");
        }
      } else {
        console.log("Retrieved My Own Team Schedule");
        const data = await getTeamDetails(
          selectedDate?.getMonth() + 1,
          selectedDate?.getFullYear(),
          parseInt(user.reporting_manager, 10)
        );
        setSelectedManager(parseInt(user.reporting_manager, 10));
        setTeamSchedule(data.data.teamSchedule.teamSchedule);
        setShowCalendar(true); // Display the calendar after the user select the team to view
      }
    };
    fetchSchedule();
  }, [selectedDate]);

  const handleDialogOpen = async (open: boolean) => {
    if (open) {
      try {
        console.log(selectedManager);
        const response = await getTeamDetails(
          selectedDate?.getMonth() + 1,
          selectedDate?.getFullYear(),
          selectedManager
        );
        setDialogData(response.data.teamSchedule.teamSchedule[0].availability);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const handleManagerChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const managerId = parseInt(event.target.value, 10);
    setSelectedManager(managerId); // Update the selected manager's ID
    // Assuming there's a method to fetch team schedule based on manager ID
    const data = await getTeamDetails(
      selectedDate?.getMonth() + 1,
      selectedDate?.getFullYear(),
      managerId
    );
    setTeamSchedule(data.data.teamSchedule.teamSchedule);
    setShowCalendar(true); // Display the calendar after the user select the team to view
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
                {user.position === "Director" ? 
           
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                      {managerList.map((manager) => (
                        <SelectItem key={manager.staffId} value={manager.staffId}>
                          {`${manager.position} - ${manager.name} - ${manager.staffId}`}
                        </SelectItem>
                      ))}
                      </SelectGroup>
              
                
                    </SelectContent>
                  </Select>
                  : "My Team"}  
              <MonthlyNav />
            </div>
           
            <MonthlyBody events={teamSchedule}>
              <Dialog onOpenChange={handleDialogOpen}>
                <DialogTrigger>
                  <MonthlyDay<EventType>
                    renderDay={(data) =>
                      data.map((item) => (
                        <TeamMonthlyEventItem
                          key={`${item.date}-${item.type}`}
                          availability={item.availableCount || 0}
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
                  <ScrollArea className="h-[calc(90vh-100px)] px-4 sm:px-0">
                    <DataTable
                      columns={availability_columns}
                      data={dialogData ? dialogData : []}
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
