"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Availability, IndividualRequest, Request } from "@/types";
import { Badge } from "./ui/badge";

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
          variant={
            row.original.status == "pending"
              ? "warning"
              : row.original.status == "approved"
              ? "success"
              : row.original.status == "pending_withdrawal"
              ? "secondary"
              : row.original.status == "withdrawn"
              ? "tertiary"
              : "destructive"
          }
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
          variant={
            row.original.status == "pending"
              ? "warning"
              : row.original.status == "approved"
              ? "success"
              : row.original.status == "pending_withdrawal"
              ? "secondary"
              : row.original.status == "withdrawn"
              ? "tertiary"
              : "destructive"
          }
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
          variant={row.original.isPending === "true" ? "warning" : "success"}
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
