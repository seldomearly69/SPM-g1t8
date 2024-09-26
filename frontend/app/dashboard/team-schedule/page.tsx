import { useEffect, useState} from "react"
import { getDepartmentSchedule, getTeamDetails, getTeamSchedule } from "@/service/schedule";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getCurrentUser } from "@/lib/session";
import TeamSchedule from "@/components/team-schedule";
import * as motion from "framer-motion/client";

// const mockAvailability = [
//   { employee_name: "John Doe", department: "Engineering", availability: "Office", type: "AM", is_pending: false },
//   { employee_name: "Jane Smith", department: "Marketing", availability: "Office", type: "AM", is_pending: false },
//   { employee_name: "Alice Johnson", department: "Sales", availability: "Office", type: "AM", is_pending: false },
//   { employee_name: "Bob Brown", department: "Engineering", availability: "Office", type: "AM", is_pending: false },
//   { employee_name: "Charlie Davis", department: "Marketing", availability: "Office", type: "AM", is_pending: false },
//   { employee_name: "Diana White", department: "Sales", availability: "Office", type: "AM", is_pending:true },
//   { employee_name: "Eve Green", department: "Engineering", availability: "Office", type: "AM", is_pending: false },    
// ]


export default async function TeamSchedulePage() {
  
    const user = await getCurrentUser();

   
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
      
      <TeamSchedule user={user}/>
      </motion.div>
   
    </motion.div>
  );
}
