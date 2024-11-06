"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { acceptRejectTransferRequest } from "@/service/transfer_manager";
import { TransferRequest, User } from "@/types";
import { useState } from "react";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { usePathname, useRouter } from "next/navigation";

interface TransferManagerProps {
  _transferRequests: TransferRequest[];
  user: User;
}

export default function TransferManager({
  _transferRequests,
  user,
}: TransferManagerProps) {
  const [transferRequests, setTransferRequests] =
    useState<TransferRequest[]>(_transferRequests);

  const router = useRouter();
  const pathname = usePathname();

  const handleAcceptReject = async (requestId: number, response: any) => {
    const res = await acceptRejectTransferRequest(response, requestId);
    setTransferRequests(
      transferRequests.filter((request: any) => request.requestId !== requestId)
    );
    toast({
      title: "Transfer Request Submitted",
      description: res.data.acceptRejectTransferRequest.message,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between items-center space-x-2">
            <span>Transfer Requests</span>
            <Button
              variant="outline"
              onClick={() => router.push(pathname + "/view-transfer")}
            >
              View All
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transferRequests.length === 0 && <p>You have no transfer requests.</p>}
        {transferRequests.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Name</TableHead>
                <TableHead className="text-left">Reason</TableHead>
                <TableHead className="text-left">Status / Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transferRequests.map((request: any) => (
                <TableRow key={request.requestId}>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatars/01.png" alt="Avatar" />
                        <AvatarFallback>
                          {request.requestingManagerId == user.staffId
                            ? request.targetManagerName
                                .slice(0, 2)
                                .toUpperCase()
                            : request.requestingManagerName
                                .slice(0, 2)
                                .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {request.requestingManagerId == user.staffId
                            ? request.targetManagerName
                            : request.requestingManagerName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {request.requestingManagerId == user.staffId
                            ? request.targetManagerEmail
                            : request.requestingManagerEmail}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm truncate text-ellipsis overflow-hidden whitespace-nowrap max-w-[200px]">
                    {request.reason}
                  </TableCell>
                  <TableCell>
                    {request.requestingManagerId == user.staffId ? (
                      <Badge
                        variant={
                          request.status === "accepted"
                            ? "success"
                            : request.status === "rejected"
                            ? "destructive"
                            : "warning"
                        }
                      >
                        {request.status}
                      </Badge>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="ml-auto"
                          onClick={() =>
                            handleAcceptReject(request.requestId, "accepted")
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          className="ml-2"
                          onClick={() =>
                            handleAcceptReject(request.requestId, "rejected")
                          }
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
