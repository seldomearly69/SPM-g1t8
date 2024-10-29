"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Request } from "@/types";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardStat({ stats }: { stats: Request[] }) {
  console.log(stats);

  const router = useRouter();
  const pathname = usePathname();

  const statsConfig = {
    pending: "Requests",
    approved: "Approved",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
  };

  const aggregatedStats = stats.reduce((acc: any, curr: Request) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between items-center space-x-2">
            <span>WFH Requests</span>
            <Button
              variant="outline"
              onClick={() => router.push(pathname + "/manage")}
            >
              Manage Arrangement
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border-b  border-b-gray-300/10 lg:border-t lg:border-t-gray-300/5 bg-page-gradient bg-opacity-10">
          <dl className="mx-auto  grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
            {Object.entries(statsConfig).map(([status, label], statIdx) => (
              <div
                key={status}
                className={cn(
                  statIdx % 2 === 1
                    ? "sm:border-l"
                    : statIdx === 2
                    ? "lg:border-l"
                    : "",
                  "flex flex-wrap group  relative items-baseline justify-between gap-x-4 gap-y-2 border-t border-gray-300/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8"
                )}
              >
                <dt className="text-sm font-medium leading-6 text-gray-500">
                  {label}
                </dt>

                <dd
                  className={cn(
                    "w-full flex-none text-3xl font-medium leading-10 tracking-tight",
                    status === "rejected"
                      ? "text-rose-600"
                      : status === "approved"
                      ? "text-green-600"
                      : status === "withdrawn"
                      ? "text-tertiary"
                      : "text-yellow-600"
                  )}
                >
                  {String(
                    aggregatedStats[status] ? aggregatedStats[status] : 0
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}
