"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "./ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Button } from "./ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { availability, department, schedule_status, type } from "@/config/request";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;


  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by Employee Name"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={schedule_status}
          />
        )}
        {table.getColumn("department") && (
          <DataTableFacetedFilter
            column={table.getColumn("department")}
            title="Department"
            options={department}
          />
        )}
        {table.getColumn("availability") && (
          <DataTableFacetedFilter
            column={table.getColumn("availability")}
            title="Availability"
            options={availability}
          />
        )}
         {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={type}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
