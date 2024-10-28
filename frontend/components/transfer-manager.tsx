"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { acceptRejectTransferRequest } from "@/service/transfer_manager";
import { TransferRequest, User } from "@/types";
import { useState } from "react";
import { Badge } from "./ui/badge";

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
        <CardTitle>Transfer Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {transferRequests.length === 0 && <p>You have no transfer requests.</p>}
        {transferRequests.length > 0 &&
          transferRequests.filter(
            (request: TransferRequest) => request.status === "pending"
          ).length > 0 && (
            <>
              <div className="space-y-8">
                {transferRequests
                  .filter((request: any) => request.status === "pending")
                  .map((request: any) => (
                    <div className="flex items-center" key={request.requestId}>
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatars/01.png" alt="Avatar" />
                        <AvatarFallback>OM</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {request.requestingManager}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          olivia.martin@email.com
                        </p>
                      </div>
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
                    </div>
                  ))}
              </div>

              {transferRequests.filter(
                (request: TransferRequest) =>
                  request.requestingManager == user.staffId
              ).length > 0 && (
                <>
                  {transferRequests
                    .filter(
                      (request: TransferRequest) =>
                        request.requestingManager == user.staffId
                    )
                    .map((request: TransferRequest) => (
                      <div
                        className="flex justify-between"
                        key={request.requestId}
                      >
                        <div className="flex items-center">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src="/avatars/01.png" alt="Avatar" />
                            <AvatarFallback>OM</AvatarFallback>
                          </Avatar>
                          <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {request.requestingManager}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              olivia.martin@email.com
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <p>{request.reason}</p>
                        </div>
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
                      </div>
                    ))}
                </>
              )}
            </>
          )}

        {transferRequests.filter(
          (request: TransferRequest) => request.status !== "pending"
        ).length > 0 && (
          <>
            {transferRequests.map((request: TransferRequest) => (
              <div
                className="flex justify-between my-3"
                key={request.requestId}
              >
                <div className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/avatars/01.png" alt="Avatar" />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {request.requestingManager}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      olivia.martin@email.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <p>{request.reason}</p>
                </div>
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
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
