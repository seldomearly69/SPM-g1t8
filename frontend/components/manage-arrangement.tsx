"use client"

import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable } from "@/components/data-table";
import { individual_request_columns, request_columns } from "@/components/columns";
import { getArrangements } from "@/service/request";
import { useRouter } from "next/navigation"
import { ScrollArea } from "./ui/scroll-area";
import { User } from "@/types";

// Mock data - replace with actual API call
const mockArrangements = [
  {
    requestId: 1,
    startDate: "2023-05-15",
    endDate: "2023-05-19",
    type: "full-time",
    status: "approved",
  },
  {
    id: 2,
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    type: "part-time",
    status: "pending",
  },
  {
    id: 3,
    startDate: "2023-07-10",
    endDate: "2023-07-14",
    type: "flexible",
    status: "approved",
  },
  {
    id: 4,
    startDate: "2023-07-15",
    endDate: "2023-07-17",
    type: "flexible",
    status: "rejected",
  },
];

const mockPendingArrangements = [
  { requestId: 1, date: "2024-11-15", type: "PM", status: "pending", remarks: "remarks" },
  { requestId: 2, date: "2024-11-16", type: "AM", status: "pending", remarks: "remarks" },
  { requestId: 3, date: "2024-11-20", type: "PM", status: "pending", remarks: "remarks" },
  { requestId: 4, date: "2024-11-21", type: "AM", status: "pending", remarks: "remarks" },
  { requestId: 5, date: "2024-11-22", type: "PM", status: "pending", remarks: "remarks" },
  { requestId: 6, date: "2024-11-23", type: "AM", status: "pending", remarks: "remarks" },
  { requestId: 7, date: "2024-11-24", type: "PM", status: "pending", remarks: "remarks" },
  { requestId: 8, date: "2024-11-25", type: "AM", status: "pending", remarks: "remarks" },
  { requestId: 9, date: "2024-11-26", type: "PM", status: "pending", remarks: "remarks" },
  { requestId: 2, date: "2024-11-16", type: "AM", status: "pending", remarks: "remarks" },
  { requestId: 1, date: "2024-11-15", type: "PM", status: "pending", remarks: "remarks" },
  { requestId: 2, date: "2024-11-16", type: "AM", status: "pending", remarks: "remarks" },
  { requestId: 1, date: "2024-11-17", type: "PM", status: "approved", remarks: "remarks" },
  { requestId: 2, date: "2024-11-18", type: "AM", status: "rejected", remarks: "remasdfasdfasdfasdfasdfasdfasdfasdfsdfarks" },
  { requestId: 1, date: "2024-11-19", type: "PM", status: "approved", remarks: "remarks" },
  { requestId: 2, date: "2024-11-20", type: "AM", status: "rejected", remarks: "remarks" },
]


interface ManageArrangementsProps {
    user: User;
    }

export default function ManageArrangementsPage({user}: ManageArrangementsProps) {
  const [arrangements, setArrangements] = useState(mockPendingArrangements);
  const [pendingArrangements, setPendingArrangements] = useState(mockPendingArrangements);
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => { 
      const data = await getArrangements(user.staffId)
      console.log(data)
      setArrangements(data.data.ownRequests.requests)
    }
    fetchData()
  }, []);
  


  const handleRowClick = (row: any) => {
    router.push(`/dashboard/manage/${row.requestId}`)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Manage WFH Arrangements
      </h2>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
         <Tabs defaultValue="approved" className="h-full space-y-6">
              <div className="space-between flex items-center justify-center">
                <TabsList>
                  <TabsTrigger value="approved" className="relative">
                    Approved
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="relative">
                    Rejected
                  </TabsTrigger>
                
                </TabsList>
                
              </div>
              <TabsContent value="approved">
                    <DataTable columns={individual_request_columns} data={arrangements.filter((arr) => arr.status == "approved") } onRowClick={handleRowClick}/>
              </TabsContent>
              <TabsContent value="pending">
                    <DataTable columns={individual_request_columns} data={arrangements.filter((arr) => arr.status == "pending") } onRowClick={handleRowClick}/>
              </TabsContent>
              <TabsContent value="rejected">
                    <DataTable columns={individual_request_columns} data={arrangements.filter((arr) => arr.status == "rejected") } onRowClick={handleRowClick}/>
              </TabsContent>
          </Tabs>
      </motion.div>
       
    </div>
  );
}