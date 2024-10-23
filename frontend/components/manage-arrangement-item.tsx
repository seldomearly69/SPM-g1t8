"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { IndividualRequest } from "@/types";
import {
  getIndividualRequest,
  withdrawPendingRequest,
  withdrawApprovedRequest,
} from "@/service/request";
import { User } from "@/types";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "./ui/popover";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ManageIndividualRequestProps {
  user: User;
  params: { request_id: string };
}

export default function ManageIndividualRequest({
  user,
  params,
}: ManageIndividualRequestProps) {
  const [request, setRequest] = useState<IndividualRequest>();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">();
  const [successDialog, setSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  // Update handleWithdraw to use the entered reason from the popover
  const handleWithdraw = async () => {
    if (!request?.requestId) return; // Ensure requestId is not undefined

    let data;
    if (status === "approved") {
      if (!reason) return; // Ensure reason is provided for approved requests
      console.log("Its here");
      data = await withdrawApprovedRequest(request.requestId, reason); // Call with reason
    } else if (status === "pending") {
      console.log("fk");
      data = await withdrawPendingRequest(request.requestId); // Call without reason
    }

    console.log(data);
    if (
      data.data.withdrawPendingRequest?.success ||
      data.data.withdrawApprovedRequest?.success
    ) {
      setSuccessMessage(
        `Request #${params.request_id} has been successfully withdrawn.`
      );
      setSuccessDialog(true); // Open the success dialog
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getIndividualRequest(parseInt(params.request_id));
      setRequest(data.data.request);
      setStatus(data.data.request.status); // Set the status based on the fetched request data
      console.log(data.data.request);
    };
    fetchData();
  }, [params.request_id]);

  if (!request) return <div>Loading...</div>;

  // Success Dialog Component
  function SuccessDialog({
    isOpen,
    onClose,
    successMessage,
    redirectBack,
  }: {
    isOpen: boolean;
    onClose: (isOpen: boolean) => void;
    successMessage: string;
    redirectBack: () => void;
  }) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="md:max-w-[425px] text-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Request Managed!</DialogTitle>
            <DialogDescription className="text-md">
              {successMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={redirectBack} className="text-md">
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        WFH Request #{params.request_id}
      </h1>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" value={request?.date} readOnly />
        </div>
        <div>
          <Label htmlFor="requested-on">Requested on</Label>
          <Input id="requested-on" value={request?.createdAt} readOnly />
        </div>
        <div>
          <Label htmlFor="request-type">Request Type</Label>
          <Input id="request-type" value={request?.type} readOnly />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Input id="status" value={request?.status} readOnly />
        </div>
        <div className="col-span-2">
          <Label className="block mb-2">Reason</Label>
          <Textarea value={request?.reason} rows={4} readOnly />
        </div>
        <div className="col-span-2">
          <Label className="block mb-2">Remarks from Supervisor</Label>
          <Textarea value={request?.remarks} rows={4} readOnly />
        </div>
      </div>

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <div className="mt-6 flex justify-between space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          {status === "approved" ? (
            <PopoverTrigger asChild>
              <Button size="sm" className="hover:text-red-500">
                Cancel Request
              </Button>
            </PopoverTrigger>
          ) : status === "pending" ? (
            <Button variant="outline" onClick={() => setIsPopoverOpen(true)}>
              Withdraw
            </Button>
          ) : null}
        </div>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Reason</h4>
              <p className="text-sm text-muted-foreground">
                Enter the reason for the withdrawal
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Textarea
                  onChange={(e) => setReason(e.target.value)}
                  value={reason}
                  className="col-span-3 h-8"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Button
                onClick={() => {
                  handleWithdraw();
                  setIsPopoverOpen(false);
                }}
                variant="outline"
              >
                Submit
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {/* Success Dialog */}
      <SuccessDialog
        isOpen={successDialog}
        onClose={setSuccessDialog}
        successMessage={successMessage}
        redirectBack={() => window.location.reload()}
      />
    </div>
  );
}
