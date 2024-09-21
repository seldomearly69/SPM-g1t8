"use client"

import { DefaultMonthlyEventItem, MonthlyBody, MonthlyCalendar, MonthlyDay, MonthlyNav } from "@/components/monthly-calendar";
import { useEffect, useState} from "react"
import { Availability, EventType } from "@/types";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DataTable } from "@/components/data-table";
import { availability_columns } from "@/components/columns";
import { getTeamDetails, getTeamSchedule } from "@/service/schedule";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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

const mockAvailability = [
  { employee_name: "John Doe", department: "Engineering", availability: "Office", type: "AM", is_pending: false },
  { employee_name: "Jane Smith", department: "Marketing", availability: "Office", type: "AM", is_pending: false },
  { employee_name: "Alice Johnson", department: "Sales", availability: "Office", type: "AM", is_pending: false },
  { employee_name: "Bob Brown", department: "Engineering", availability: "Office", type: "AM", is_pending: false },
  { employee_name: "Charlie Davis", department: "Marketing", availability: "Office", type: "AM", is_pending: false },
  { employee_name: "Diana White", department: "Sales", availability: "Office", type: "AM", is_pending:true },
  { employee_name: "Eve Green", department: "Engineering", availability: "Office", type: "AM", is_pending: false },    
]


export default function TeamSchedulePage() {
  const [teamSchedule, setTeamSchedule] = useState(mockSchedule);
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date()
  );
  const [dialogData, setDialogData] = useState<Availability[]>([]);


  const handleDialogOpen = async (open: boolean) => {
    if (open ) {
      try {
        const response = await getTeamDetails(selectedDate?.getMonth() + 1, selectedDate?.getFullYear(), 140001);
        console.log(response)
        setDialogData(response.data.teamSchedule.teamSchedule[0].availability);
        console.log(dialogData)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      const data = await getTeamSchedule(selectedDate?.getMonth() + 1, selectedDate?.getFullYear(), 140001);
      console.log(data.data.teamSchedule.schedule)
      setTeamSchedule(data.data.teamSchedule.teamSchedule)
    };
    fetchSchedule();
  }, [selectedDate])


   
  // let [currentMonth, setCurrentMonth] = useState<Date>(
  //   startOfMonth(new Date())
  // );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-2"
    >
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-bold mb-6"
      >
        Team Schedule
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full"
      >
        <MonthlyCalendar
          currentMonth={selectedDate || new Date()}
          onCurrentMonthChange={setSelectedDate}
        >
          <MonthlyNav />
          <MonthlyBody events={teamSchedule}>
          <Dialog onOpenChange={handleDialogOpen}>
              <DialogTrigger >
                <MonthlyDay<EventType>
                renderDay={(data) =>
                  data.map((item, index) => (
                      <DefaultMonthlyEventItem
                        availability={item.availableCount}
                        date={item.date}
                        type={item.type}
                        is_pending={item.is_pending}
                      />
                   
                  ))
                }
              />
              </DialogTrigger>
              <DialogContent className="w-full max-w-[95vw] h-[90vh] p-0 sm:p-6">
                <DialogHeader className="p-4 sm:p-0">
                  <DialogTitle>
                      {dialogData ? (
                          <></>
                          ) : (
                            <p>Loading...</p>
                          )}
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[calc(90vh-100px)] px-4 sm:px-0">
                  <DataTable columns={availability_columns} data={dialogData ? dialogData : []} />
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </DialogContent>
            </Dialog>
           
          </MonthlyBody>
        </MonthlyCalendar>
      </motion.div>
   
    </motion.div>
  );
}
