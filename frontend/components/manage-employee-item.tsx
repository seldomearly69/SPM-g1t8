"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams } from "next/navigation"; // Use this to get query params
import { useEffect, useState } from "react";

export default function ManageEmployeeArrangementsItem() {
  // Get search parameters (query string)
  const searchParams = useSearchParams();

  // Extract query parameters
  const employeeName = searchParams.get("employeeName");
  const department = searchParams.get("department");
  const date = searchParams.get("date");
  const type = searchParams.get("type");
  const requestedOn = searchParams.get("requestedOn");
  const remarks = searchParams.get("remarks");

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  // Ensure all required query parameters are available
  if (
    !employeeName ||
    !department ||
    !date ||
    !type ||
    !requestedOn ||
    !remarks
  ) {
    return <div>Missing required query parameters...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">WFH Request Details</h1>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="employee-name">Employee Name</Label>
          <Input id="employee-name" value={employeeName} readOnly />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Input id="department" value={department} readOnly />
        </div>
        <div>
          <Label htmlFor="request-type">Request Type</Label>
          <Input id="request-type" value={type} readOnly />
        </div>
        <div>
          <Label htmlFor="requested-on">Requested On</Label>
          <Input id="requested-on" value={requestedOn} readOnly />
        </div>
        <div className="col-span-2">
          <Label className="block mb-2">WFH Date</Label>
          <Input id="wfh-date" value={date} readOnly />
        </div>
        <div className="col-span-2">
          <Label className="block mb-2">Remarks</Label>
          <Textarea value={remarks} rows={4} readOnly />
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <Button variant="outline">Reject</Button>
        <Button>Approve</Button>
      </div>
    </div>
  );
}
