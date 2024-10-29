"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { request_columns } from "@/components/columns";
import { useRouter } from "next/navigation";
import { TransferRequest, User } from "@/types";
import { getSubordinatesRequest } from "@/service/request";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import AssignManagerForm from "./assign-manager-form";
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { revertTransferRequest } from "@/service/transfer_manager";

interface ManageEmployeeArrangementsProps {
  user: User;
  _transferRequests: TransferRequest[];
}

export default function ManageEmployeeArrangements({
  user,
  _transferRequests,
}: ManageEmployeeArrangementsProps) {
  const [employeeRequests, setEmployeeRequests] = useState<any[]>([]); // Updated to handle real data
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  console.log(user);

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

  const handleRevertTransferRequest = async (requestId: number) => {
    const res = await revertTransferRequest(requestId);
    console.log(res);
  };

  return (
    <Card>
      <CardContent className="pt-8 relative">
        {_transferRequests.filter(
          (request: TransferRequest) =>
            request.requestingManager == user.staffId &&
            request.status === "accepted"
        ).length > 0 && (
          <div className="absolute inset-0 z-50 bg-black/80 rounded-xl">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-white text-lg mb-4">
                Currently passing my job to manager{" "}
                {_transferRequests
                  .filter(
                    (request: TransferRequest) =>
                      request.requestingManager == user.staffId &&
                      request.status === "accepted"
                  )
                  .map((request: TransferRequest) => request.targetManager)}
              </div>
              <Button
                variant="secondary"
                onClick={() =>
                  handleRevertTransferRequest(
                    _transferRequests.filter(
                      (request: TransferRequest) =>
                        request.requestingManager == user.staffId &&
                        request.status === "accepted"
                    )[0].requestId
                  )
                }
              >
                Reclaim back my job
              </Button>
            </div>
          </div>
        )}
        <div className="flex">
          <Tabs defaultValue="pending" className="h-full space-y-6 w-full">
            <div className="flex items-center justify-center relative flex-col space-y-2 md:space-y-0 md:flex-row">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Button
                  className="flex items-center md:absolute md:right-1"
                  onClick={() => setIsDialogOpen(true)}
                  disabled={user.awayManager !== null}
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
      </CardContent>
    </Card>
  );
}
