"use client";

import { useEffect, useState } from "react";
import { fetchPendingRequests } from "@/service/requests";

interface Request {
  requestId: number;
  employeeName: string;
  status: string;
}

export default function PendingRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRequests() {
      try {
        const data = await fetchPendingRequests();
        setRequests(data);
      } catch (err) {
        setError("Failed to load pending requests");
      }
    }
    loadRequests();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Pending Requests</h2>
      <ul>
        {requests.map((request) => (
          <li key={request.requestId}>
            {request.employeeName} - {request.status}
          </li>
        ))}
      </ul>
    </div>
  );
}