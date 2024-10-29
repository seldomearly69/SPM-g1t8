"use client";

import { TransferRequest } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export default function ViewTransfer({
  transferRequests,
}: {
  transferRequests: TransferRequest[];
}) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Request ID</TableHead>
            <TableHead className="text-left">Requesting Manager</TableHead>
            <TableHead className="text-left">Target Manager</TableHead>
            <TableHead className="text-left">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transferRequests.map((request) => (
            <TableRow key={request.requestId}>
              <TableCell>{request.requestId}</TableCell>
              <TableCell>{request.requestingManagerName}</TableCell>
              <TableCell>{request.targetManagerName}</TableCell>
              <TableCell>{request.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
