"use client";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { Availability, IndividualRequest, Request } from "@/types";
import { Check, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

export const request_columns: ColumnDef<Request>[] = [
  {
    accessorKey: "requestId",
    header: "ID",
  },
  {
    accessorKey: "requestingStaffName",
    header: "Employee Name",
    id: "requestingStaffName",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "createdAt",
    header: "Requested On",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          className={cn(
            "w-20 justify-center ",
            row.original.status == "pending"
              ? "bg-yellow-500"
              : row.original.status == "approved"
              ? "bg-emerald-500"
              : row.original.status == "pending_withdrawal"
              ? "w-34 bg-blue-500"
              : "bg-red-500"
          )}
        >
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
];

// export const request_columns: ColumnDef<Request>[] = [
//   {
//     accessorKey: "requestId",
//     header: "ID",
//   },
//   {
//     accessorKey: "employeeName",
//     header: "Employee Name",
//   },
//   {
//     accessorKey: "department",
//     header: "Department",
//   },
//   {
//     accessorKey: "date",
//     header: "Date",
//   },
//   {
//     accessorKey: "type",
//     header: "Type",
//   },
//   {
//     accessorKey: "requestedOn",
//     header: "Requested On",
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//   },
//   {
//     accessorKey: "remarks",
//     header: "Remarks",
//   },

//   // {
//   //     accessorKey: "actions",
//   //     header: "Actions",
//   //     cell: ({ row }) => {
//   //         return <div>
//   //             <Button>Approve</Button>
//   //             <Button>Reject</Button>
//   //         </div>
//   //     }
//   // }
// ];

const ActionCell = ({ row }: { row: Row<Request> }) => {
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">(
    "pending"
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  console.log(row);
  return (
    <div>
      <Button variant="ghost" size="sm" className="hover:text-green-500">
        <Check className="w-4 h-4" />
      </Button>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="hover:text-red-500">
            <X className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Reason</h4>
              <p className="text-sm text-muted-foreground">
                Enter the reason for the rejection
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Textarea className="col-span-3 h-8" />
              </div>
            </div>
            <div className="grid gap-2">
              <Button
                onClick={() => {
                  setStatus("rejected");
                  console.log(status);
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
    </div>
  );
};

export const individual_request_columns: ColumnDef<IndividualRequest>[] = [
  {
    accessorKey: "requestId",
    header: "ID",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "remarks",
    header: "Superior Remarks",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          className={cn(
            "w-20 justify-center ",
            row.original.status == "pending"
              ? "bg-yellow-500"
              : row.original.status == "approved"
              ? "bg-emerald-500"
              : row.original.status == "pending_withdrawal"
              ? "w-34 bg-blue-500"
              : "bg-red-500"
          )}
        >
          {row.original.status}
        </Badge>
      );
    },
  },
];

export const availability_columns: ColumnDef<Availability>[] = [
  {
    accessorKey: "name",
    header: "Employee Name",
    enableColumnFilter: true,
  },
  {
    accessorKey: "department",
    header: "Department",
    enableColumnFilter: true,
  },
  {
    accessorKey: "availability",
    header: "Availability",
    enableColumnFilter: true,
  },
  {
    accessorKey: "type",
    header: "Type",
    enableColumnFilter: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status =
        row.original.isPending === "true" ? "Pending" : "Confirmed";
      return (
        <Badge
          className={
            row.original.isPending === "true"
              ? "bg-yellow-500"
              : "bg-emerald-500"
          }
        >
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(
        row.original.isPending === "true" ? "Pending" : "Confirmed"
      );
    },
  },
];
