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
  }) => {
    const queryParams = new URLSearchParams({
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
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="acceptedRejected">
            Accepted / Rejected
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <DataTable
                columns={request_columns}
                data={employeeRequests.filter(
                  (request) => request.status === "pending"
                )}
                onRowClick={handleRowClick}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="acceptedRejected">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Accepted / Rejected Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <DataTable
                columns={request_columns}
                data={employeeRequests.filter(
                  (request) =>
                    request.status === "approved" ||
                    request.status === "rejected"
                )}
                onRowClick={handleRowClick}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
