"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams } from "next/navigation"; // Use this to get query params
import { useEffect, useState } from "react";
import { approveRequest } from "@/service/request";
import { getFileLink } from "@/service/request";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ManageEmployeeArrangementsItem() {
  // State variables
  const [isMounted, setIsMounted] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState(""); // Stores the rejection reason
  const [successMessage, setSuccessMessage] = useState(""); // Stores the success message

  // Get search parameters (query string)
  const searchParams = useSearchParams();
  const requestId = searchParams?.get("requestId") ?? "";
  const employeeName = searchParams?.get("employeeName") ?? "";
  const department = searchParams?.get("department") ?? "";
  const date = searchParams?.get("date") ?? "";
  const type = searchParams?.get("type") ?? "";
  const createdAt = searchParams?.get("createdAt") ?? "";
  const reason = searchParams?.get("reason") ?? "";
  const remarks = searchParams?.get("remarks") ?? "";
  const status = searchParams?.get("status") ?? "";
  const files = searchParams?.get("files") ?? ""; // This is the comma-separated string of file URLs

  // Ensure the component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  // Ensure all required query parameters are available
  if (!employeeName || !department || !date || !type || !createdAt || !reason) {
    return <div>Missing required query parameters...</div>;
  }

  // Approve request handler
  const handleApprove = async () => {
    const response = await approveRequest(parseInt(requestId), "approved", "");
    if (response.data.acceptRejectRequest.success) {
      setSuccessMessage(`Request by ${employeeName} has been approved!`);
      setSuccessDialog(true);
    }
  };

  // Open reject dialog
  const handleReject = () => {
    setRejectDialog(true);
  };

  // Submit rejection
  const rejectArrangement = async () => {
    const response = await approveRequest(
      parseInt(requestId),
      "rejected",
      rejectionReason
    );
    if (response.data.acceptRejectRequest.success) {
      setSuccessMessage(`Request by ${employeeName} has been rejected.`);
      setSuccessDialog(true);
      setRejectDialog(false); // Close the reject dialog
    }
  };

  // Redirect to the previous page
  const redirectBack = () => {
    window.history.back();
  };

  // Retrieve file URLs from the comma-separated string
  const retrieveFileUrls = () => {
    if (files) {
      const fileUrls = files.split(","); // Split the string into an array of URLs

      fileUrls.forEach(async (fileUrl) => {
        console.log(fileUrl);
        try {
          await downloadFile(fileUrl.trim()); // Download the file directly
        } catch (error) {
          console.error("Error fetching file link:", error);
        }
      });
    }
  };

  const downloadFile = async (fileLink: string) => {
    try {
      const response = await getFileLink(fileLink);

      console.log(response);
      const downloadUrl = response.fileLink;
      if (downloadUrl) {
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = fileLink.split("/").pop(); // Extract the file name from the URL
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Download URL not found for file:", fileLink);
      }
    } catch (e) {}
  };

  // Example usage:
  // retrieveFileUrls(); // This line was causing the downloadFile to run on load. It's now commented out to prevent this.
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">WFH Request Details</h1>

      {/* Request Details */}
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
          <Input id="requested-on" value={createdAt} readOnly />
        </div>
        <div className="col-span-2">
          <Label className="block mb-2">WFH Date</Label>
          <Input id="wfh-date" value={date} readOnly />
        </div>
        <div className="col-span-2">
          <Label className="block mb-2">Reason</Label>
          <Textarea value={reason} rows={4} readOnly />
        </div>
        {remarks && (
          <div className="col-span-2">
            <Label className="block mb-2">Remarks</Label>
            <Textarea value={remarks} rows={4} readOnly />
          </div>
        )}
      </div>

      {files && (
        <div className="mt-6 flex justify-start space-x-4">
          <Button onClick={retrieveFileUrls}>Download File</Button>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-4 flex justify-end space-x-4">
        {status === "pending" && (
          <>
            <Button onClick={handleApprove}>Approve</Button>
            <Button onClick={handleReject} variant="outline">
              Reject
            </Button>
          </>
        )}
        {status === "approved" && (
          <Button onClick={handleReject} variant="outline">
            Reject
          </Button>
        )}
      </div>

      {/* Dialogs */}
      <SuccessDialog
        isOpen={successDialog}
        onClose={setSuccessDialog}
        employeeName={employeeName}
        successMessage={successMessage}
        redirectBack={redirectBack}
      />

      <RejectDialog
        isOpen={rejectDialog}
        onClose={setRejectDialog}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        rejectArrangement={rejectArrangement}
      />
    </div>
  );
}

// Success Dialog Component
function SuccessDialog({
  isOpen,
  onClose,
  employeeName,
  successMessage,
  redirectBack,
}: {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
  employeeName: string;
  successMessage: string;
  redirectBack: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-[425px] text-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Arrangement Managed!</DialogTitle>
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

// Reject Dialog Component
function RejectDialog({
  isOpen,
  onClose,
  rejectionReason,
  setRejectionReason,
  rejectArrangement,
}: {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  rejectArrangement: () => Promise<void>;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-[600px] text-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Reject Arrangement</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4">
            <Label htmlFor="rejectionReason" className="text-sm font-bold">
              Reason for Rejection
            </Label>
            <Textarea
              id="rejectionReason"
              className="text-lg"
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={rejectArrangement} className="text-md">
            Ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
