"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/data-table";
import { request_columns } from "@/components/columns";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { getEmployeesRequest } from "@/service/request";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - replace with actual API call
const mockEmployeeRequests = [
  {
    requestId: 1,
    employeeName: "Alice Johnson",
    department: "Engineering",
    date: "2023-05-23",
    type: "AM",
    requestedOn: "2023-05-19",
    status: "pending",
    remarks: "need to wfh",
  },
  {
    requestId: 2,
    employeeName: "Bob Smith",
    department: "Engineering",
    date: "2023-06-23",
    type: "AM",
    requestedOn: "2023-05-30",
    status: "pending",
    remarks: "need to wfh",
  },
  {
    requestId: 3,
    employeeName: "Charlie Brown",
    department: "Engineering",
    date: "2023-07-23",
    type: "AM",
    requestedOn: "2023-07-14",
    status: "pending",
    remarks: "No remarks",
  },
  {
    requestId: 4,
    employeeName: "Lucy Van Pelt",
    department: "Engineering",
    date: "2023-07-25",
    type: "PM",
    requestedOn: "2023-07-15",
    status: "accepted",
    remarks: "Approved for afternoon leave",
  },
  {
    requestId: 5,
    employeeName: "Linus Van Pelt",
    department: "Engineering",
    date: "2023-07-27",
    type: "FULL",
    requestedOn: "2023-07-16",
    status: "rejected",
    remarks: "Rejected due to project deadline",
  },
  {
    requestId: 6,
    employeeName: "Snoopy",
    department: "Engineering",
    date: "2023-07-28",
    type: "AM",
    requestedOn: "2023-07-18",
    status: "accepted",
    remarks: "Approved for morning leave",
  },
  {
    requestId: 7,
    employeeName: "Peppermint Patty",
    department: "Engineering",
    date: "2023-07-30",
    type: "PM",
    requestedOn: "2023-07-20",
    status: "rejected",
    remarks: "Rejected due to team shortage",
  },
  {
    requestId: 8,
    employeeName: "Marcie",
    department: "Engineering",
    date: "2023-08-01",
    type: "FULL",
    requestedOn: "2023-07-21",
    status: "accepted",
    remarks: "Approved for full day leave",
  },
];

interface ManageEmployeeArrangementsProps {
  user: User;
}

export default async function ManageEmployeeArrangements({
  user,
}: ManageEmployeeArrangementsProps) {
  const [employeeRequests, setEmployeeRequests] =
    useState(mockEmployeeRequests);
  const router = useRouter();

  useEffect(() => {
    // TODO: Fetch actual employee requests data from API
    // setEmployeeRequests(await fetchEmployeeRequests())
    console.log(user);

    const fetchPendingRequests = async () => {
      const data = await getEmployeesRequest(user.staffId);
      const pendingRequests = data.filter(
        (request) => request.status === "pending"
      );
      setEmployeeRequests(pendingRequests);
    };
    fetchPendingRequests();
  }, []);

  console.log(user);

  const handleRowClick = (row: any) => {
    router.push(`/dashboard/manage-employees/${row.id}`);
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
