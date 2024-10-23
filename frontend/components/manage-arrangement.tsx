"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable } from "@/components/data-table";
import { individual_request_columns } from "@/components/columns";
import { getOwnRequest } from "@/service/request";
import { useRouter } from "next/navigation";
import { User } from "@/types";

interface ManageArrangementsProps {
  user: User;
}

export default function ManageArrangementsPage({
  user,
}: ManageArrangementsProps) {
  const [arrangements, setArrangements] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getOwnRequest(user.staffId);
      console.log(data);
      setArrangements(data.data.ownRequests.requests);
    };
    fetchData();
  }, []);

  const handleRowClick = (row: any) => {
    router.push(`/dashboard/manage/${row.requestId}`);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs defaultValue="approved" className="h-full space-y-6">
        <div className="space-between flex items-center justify-center">
          <TabsList>
            <TabsTrigger value="approved" className="relative">
              Approved
            </TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="rejected" className="relative">
              Rejected
            </TabsTrigger>
            <TabsTrigger value="withdrawn">Withdrawn</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="approved">
          <DataTable
            columns={individual_request_columns}
            data={arrangements.filter((arr) => arr.status == "approved")}
            onRowClick={handleRowClick}
          />
        </TabsContent>
        <TabsContent value="pending">
          <DataTable
            columns={individual_request_columns}
            data={arrangements.filter(
              (arr) =>
                arr.status == "pending" || arr.status == "pending_withdrawal"
            )}
            onRowClick={handleRowClick}
          />
        </TabsContent>
        <TabsContent value="rejected">
          <DataTable
            columns={individual_request_columns}
            data={arrangements.filter((arr) => arr.status == "rejected")}
            onRowClick={handleRowClick}
          />
        </TabsContent>
        <TabsContent value="withdrawn">
          <DataTable
            columns={individual_request_columns}
            data={arrangements.filter((arr) => arr.status == "withdrawn")}
            onRowClick={handleRowClick}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
