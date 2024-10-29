"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { request_columns } from "@/components/columns";
import { useRouter } from "next/navigation";
import { SubordinatesRequest, TransferRequest, User } from "@/types";
import { getSubordinatesRequest } from "@/service/request";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckIcon, Clock, PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import AssignManagerForm from "./assign-manager-form";
import { Card, CardContent } from "./ui/card";
import { revertTransferRequest } from "@/service/transfer_manager";
import { toast } from "@/hooks/use-toast";

interface ManageEmployeeArrangementsProps {
  user: User;
  _transferRequests: TransferRequest[];
}

export default function ManageEmployeeArrangements({
  user,
  _transferRequests,
}: ManageEmployeeArrangementsProps) {
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>(
    _transferRequests.sort((a, b) => a.requestId - b.requestId)
  );
  const [employeeRequests, setEmployeeRequests] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  console.log(transferRequests);

  const has_transferred_request = (transferRequests: TransferRequest[]) => {
    return (
      transferRequests.length > 0 &&
      transferRequests[transferRequests.length - 1].status === "accepted" &&
      transferRequests[transferRequests.length - 1].requestingManagerId ==
        user.staffId
    );
  };

  const has_pending_transfer_request = (
    transferRequests: TransferRequest[]
  ) => {
    return (
      transferRequests.length > 0 &&
      transferRequests[transferRequests.length - 1].status === "pending" &&
      transferRequests[transferRequests.length - 1].requestingManagerId ==
        user.staffId
    );
  };

  const has_accepted_transfer_request = (
    transferRequests: TransferRequest[]
  ) => {
    return (
      transferRequests.length > 0 &&
      transferRequests[transferRequests.length - 1].status === "accepted"
    );
  };

  useEffect(() => {
    // Fetch actual employee requests data from API
    const fetchPendingRequests = async () => {
      try {
        const subordinateRequests: SubordinatesRequest[] = await getSubordinatesRequest(
          user.staffId
        ).then((res) => res.subordinatesRequest);
        if (subordinateRequests) {
          setEmployeeRequests(subordinateRequests);
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
    setTransferRequests(
      transferRequests.map((request) =>
        request.requestId === requestId
          ? { ...request, status: "reverted" }
          : request
      )
    );
    const res = await revertTransferRequest(requestId);
    console.log(res);
    toast({
      title: "Success",
      description: "Request reverted successfully",
    });
  };

  return (
    <Card>
      <CardContent className="pt-8 relative">
        {has_transferred_request(transferRequests) && (
          <div className="absolute inset-0 z-50 bg-black/80 rounded-xl">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-white text-lg mb-4">
                Currently passing my job to manager{" "}
                {
                  transferRequests[transferRequests.length - 1]
                    .targetManagerName
                }
              </div>
              <Button
                variant="secondary"
                onClick={() =>
                  handleRevertTransferRequest(
                    transferRequests[transferRequests.length - 1].requestId
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
                  variant={
                    has_pending_transfer_request(transferRequests)
                      ? "secondary"
                      : has_transferred_request(transferRequests)
                      ? "ghost"
                      : "primary"
                  }
                  disabled={
                    has_pending_transfer_request(transferRequests) ||
                    has_accepted_transfer_request(transferRequests)
                  }
                >
                  {has_pending_transfer_request(transferRequests) ? (
                    <>
                      <Clock className="w-4 h-4 mr-2" />
                      Awaiting approval
                    </>
                  ) : has_accepted_transfer_request(transferRequests) &&
                    transferRequests[transferRequests.length - 1]
                      .targetManagerId == user.staffId ? (
                    <>
                      <CheckIcon className="w-4 h-4 mr-2" />
                      Currently taking over{" "}
                      {
                        transferRequests[transferRequests.length - 1]
                          .requestingManagerName
                      }
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Assign Manager
                    </>
                  )}
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
                    setTransferRequests={setTransferRequests}
                    transferRequests={transferRequests}
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
