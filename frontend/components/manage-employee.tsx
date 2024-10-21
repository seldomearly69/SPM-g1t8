"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/data-table";
import { request_columns } from "@/components/columns";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { getSubordinatesRequest } from "@/service/request";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface ManageEmployeeArrangementsProps {
  user: User;
}

export default function ManageEmployeeArrangements({
  user,
}: ManageEmployeeArrangementsProps) {
  const [employeeRequests, setEmployeeRequests] = useState<any[]>([]); // Updated to handle real data
  const router = useRouter();

  useEffect(() => {
    // Fetch actual employee requests data from API
    const fetchPendingRequests = async () => {
      try {
        const data = await getSubordinatesRequest(user.staffId);
        console.log(data);
        if (data && data.subordinatesRequest) {
          setEmployeeRequests(data.subordinatesRequest);
        } else {
          setEmployeeRequests([]);
        }
      } catch (error) {
        console.error("Error fetching subordinates' requests:", error);
      }
    };
    fetchPendingRequests();
  }, [user.staffId]);

  const handleRowClick = (row: {
    requestId: number;
    requestingStaffName: string;
    department: string;
    date: string;
    type: string;
    createdAt: string;
    reason: string;
    remarks: string;
    status: string;
    files: string[];
  }) => {
    let queryParams = new URLSearchParams({
      requestId: row.requestId.toString(),
      employeeName: row.requestingStaffName,
      department: row.department,
      date: row.date,
      type: row.type,
      createdAt: row.createdAt,
      reason: row.reason,
      remarks: row.remarks,
      status: row.status,
    }).toString();

    if (row.files.length > 0) {
      queryParams = queryParams + `&files=${row.files.join(",")}`; // Convert array of file addresses to a comma-separated string
    }

    // Append query parameters to the pathname
    router.push(`/dashboard/manage-employees/${row.requestId}?${queryParams}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-full mx-auto pr-4"
    >
      <h2 className="text-2xl font-bold mb-6">Manage Employee WFH Requests</h2>
      <Tabs defaultValue="pending" className="h-full space-y-6">
        <div className="space-between flex items-center justify-center">
          <TabsList>
            <TabsTrigger value="pending" className="relative">
              Pending
            </TabsTrigger>
            <TabsTrigger value="approved" className="relative">
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" className="relative">
              Rejected
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pending">
          <DataTable
            columns={request_columns}
            data={employeeRequests.filter(
              (request) => request.status === "pending"
            )}
            onRowClick={handleRowClick}
          />
        </TabsContent>

        <TabsContent value="approved">
          <DataTable
            columns={request_columns}
            data={employeeRequests.filter(
              (request) => request.status === "approved"
            )}
            onRowClick={handleRowClick}
          />
        </TabsContent>

        <TabsContent value="rejected">
          <DataTable
            columns={request_columns}
            data={employeeRequests.filter(
              (request) => request.status === "rejected"
            )}
            onRowClick={handleRowClick}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
