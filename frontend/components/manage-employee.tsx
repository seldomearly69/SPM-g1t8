"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { request_columns } from "@/components/columns";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { getSubordinatesRequest } from "@/service/request";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import AssignManagerForm from "./assign-manager-form";

interface ManageEmployeeArrangementsProps {
  user: User;
}

export default function ManageEmployeeArrangements({
  user,
}: ManageEmployeeArrangementsProps) {
  const [employeeRequests, setEmployeeRequests] = useState<any[]>([]); // Updated to handle real data
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

  // Todo: Why not pass in requestId instead
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
      name: row.requestingStaffName,
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

  const handleAssignManager = () => {};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-full mx-auto pr-4"
    >
      <h2 className="text-2xl font-bold mb-6">Manage Employee WFH Requests</h2>
      <div className="flex flex-col md:flex-row md:justify-between">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button
            className="flex items-center mb-4 md:absolute md:right-1"
            onClick={() => setIsDialogOpen(true)}
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Assign Manager
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Manager</DialogTitle>
              <DialogDescription>
                Assign a manager to the employee
              </DialogDescription>
            </DialogHeader>
            <AssignManagerForm
              user={user}
              setIsDialogOpen={setIsDialogOpen}
              employeeRequests={employeeRequests}
            />
          </DialogContent>
        </Dialog>
        <Tabs defaultValue="pending" className="h-full space-y-6">
          <div className="space-between flex items-center justify-center relative">
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
                (request) =>
                  request.status === "pending" ||
                  request.status === "pending_withdrawal"
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
      </div>
    </motion.div>
  );
}
