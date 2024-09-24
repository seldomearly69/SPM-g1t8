"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data - replace with actual API call
const mockArrangements = [
  {
    id: 1,
    startDate: "2023-05-15",
    endDate: "2023-05-19",
    type: "full-time",
    status: "approved",
  },
  {
    id: 2,
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    type: "part-time",
    status: "pending",
  },
  {
    id: 3,
    startDate: "2023-07-10",
    endDate: "2023-07-14",
    type: "flexible",
    status: "approved",
  },
];

export default function ManageArrangementsPage() {
  const [arrangements, setArrangements] = useState(mockArrangements);

  useEffect(() => {
    // TODO: Fetch actual arrangements data from API
    // setArrangements(await fetchArrangements())
  }, []);

  const handleWithdraw = async (id: number) => {
    // TODO: Implement API call to withdraw arrangement
    console.log(`Withdrawing arrangement ${id}`);
    // Update local state after successful API call
    setArrangements(arrangements.filter((arr) => arr.id !== id));
  };

  const handleCancel = async (id: number) => {
    // TODO: Implement API call to cancel pending request
    console.log(`Cancelling pending request ${id}`);
    // Update local state after successful API call
    setArrangements(arrangements.filter((arr) => arr.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Manage WFH Arrangements
      </h2>
      <div className="space-y-6">
        {arrangements.map((arrangement) => (
          <Card
            key={arrangement.id}
            className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-700">
                  {arrangement.startDate} to {arrangement.endDate}
                </h3>
                <p className="text-md text-gray-600 mt-2">
                  {arrangement.type} WFH
                </p>
              </div>
              <Badge
                variant={
                  arrangement.status === "approved" ? "success" : "warning"
                }
                className="text-sm font-medium px-3 py-1 rounded-full"
              >
                {arrangement.status}
              </Badge>
            </div>
            <div className="mt-6">
              {arrangement.status === "approved" ? (
                <Button
                  variant="destructive"
                  onClick={() => handleWithdraw(arrangement.id)}
                  className="w-full sm:w-auto"
                >
                  Withdraw Arrangement
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => handleCancel(arrangement.id)}
                  className="w-full sm:w-auto"
                >
                  Cancel Request
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
      {arrangements.length === 0 && (
        <p className="text-center text-gray-500 mt-12 text-lg">
          No current WFH arrangements or pending requests.
        </p>
      )}
    </div>
  );
}
