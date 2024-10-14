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
        if (data && data.subordinatesRequest) {
          // Set all employee requests from the backend data
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
    requestDate: string;
    remarks: string;
  }) => {
    const queryParams = new URLSearchParams({
      employeeName: row.requestingStaffName,
      department: row.department,
      date: row.date,
      type: row.type,
      requestedOn: row.requestDate,
      remarks: row.remarks,
    }).toString();

    // Append query parameters to the pathname
    router.push(`/dashboard/manage-employees/${row.requestId}?${queryParams}`);
  };

  return (
    <div className="max-w-full mx-auto pr-4">
      {" "}
      {/* Added padding on the right */}
      <h2 className="text-2xl font-bold mb-6">Manage Employee WFH Requests</h2>
      <Tabs defaultValue="pending" className="w-full">
        {/* Adjusted to scale width dynamically */}
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="acceptedRejected">
            Accepted / Rejected
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <Card className="w-full">
            {/* Adjusted to scale width dynamically */}
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
            {/* Adjusted to scale width dynamically */}
            <CardHeader>
              <CardTitle>Accepted / Rejected Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <DataTable
                columns={request_columns}
                data={employeeRequests.filter(
                  (request) =>
                    request.status === "accepted" ||
                    request.status === "rejected"
                )}
                onRowClick={handleRowClick}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
