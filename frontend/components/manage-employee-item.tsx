"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { individual_request_columns } from "@/components/columns";
import { IndividualRequest } from "@/types";
import { SourceTextModule } from "vm";

interface ManageEmployeeArrangementsItemProps {
  params: { userId: number };
}

export default function ManageEmployeeArrangementsItem({
  params,
}: ManageEmployeeArrangementsItemProps) {
  const [employeeRequests, setEmployeeRequests] = useState<IndividualRequest[]>(
    []
  );
  const mockEmployeeRequest = [
    {
      id: 1,
      type: "AM",
      date: "2023-06-01",
      status: "pending",
      remarks: "remarks",
    },
    {
      id: 2,
      type: "PM",
      date: "2023-06-02",
      status: "pending",
      remarks: "remarks",
    },
    {
      id: 3,
      type: "AM",
      date: "2023-06-03",
      status: "pending",
      remarks: "remarks",
    },
  ];
  const request = {
    id: "WFH-001",
    employeeName: "John Doe",
    department: "Engineering",
    type: "full-time",
    status: "pending",
    date: new Date("2023-06-01").toLocaleDateString(),

    reason: "Working on a critical project that requires deep focus.",
  };

  const handleApprove = async (id: number) => {
    // TODO: Implement API call to approve request
    console.log(`Approving request ${id}`);
    // Update local state after successful API call
    setEmployeeRequests(
      employeeRequests.map((req) =>
        req.id === id ? { ...req, status: "approved" } : req
      )
    );
  };

  const handleReject = async (id: number) => {
    // TODO: Implement API call to reject request
    console.log(`Rejecting request ${id}`);
    // Update local state after successful API call
    setEmployeeRequests(
      employeeRequests.map((req) =>
        req.id === id ? { ...req, status: "rejected" } : req
      )
    );
  };
  useEffect(() => {
    // TODO: Fetch request data based on id
    // setRequest(await fetchRequest(id))
    setEmployeeRequests(mockEmployeeRequest);
  }, [params.request_id]);

  if (!request) return <div>Loading...</div>;
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        WFH Request #{params.request_id}
      </h1>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="employee-name">Employee Name</Label>
          <Input id="employee-name" value={request.employeeName} readOnly />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Input id="department" value={request.department} readOnly />
        </div>
        <div>
          <Label htmlFor="request-type">Request Type</Label>
          <Input id="request-type" value={request.type} readOnly />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Input id="status" value={request.status} readOnly />
        </div>
        <div className="col-span-2">
          <Label className="block mb-2">WFH Date</Label>
          <Input id="wfh-date" value={request.date} readOnly />
        </div>
        <div className="col-span-2">
          <Label className="block mb-2">Reason</Label>
          <Textarea value={request.reason} rows={4} />
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <Button variant="outline">Reject</Button>
        <Button>Approve</Button>
      </div>
    </div>
  );
}
