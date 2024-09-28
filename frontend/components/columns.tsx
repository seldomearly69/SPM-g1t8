"use client"
import { ColumnDef, Row } from "@tanstack/react-table"
import { Button } from "./ui/button"
import { Availability,  Request } from "@/types"
import { Check, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Textarea } from "./ui/textarea"
import { useState } from "react"
import { Badge } from "./ui/badge"

export const request_columns: ColumnDef<Request>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "employeeName",
        header: "Employee Name",
    },
    {
        accessorKey: "department",
        header: "Department",
    },

    {
        accessorKey: "requested_on",
        header: "Requested On",
    },
    {
        accessorKey: "status",
        header: "Status",
    },

    // {
    //     accessorKey: "actions",
    //     header: "Actions",
    //     cell: ({ row }) => {
    //         return <div>
    //             <Button>Approve</Button>
    //             <Button>Reject</Button>
    //         </div>
    //     }
    // }
]

const ActionCell = ({ row }: {row: Row<Request>}) => {
    const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    return <div>
       
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
                        <Textarea
                            className="col-span-3 h-8"
                        />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Button onClick={() =>{
                            setStatus('rejected') 
                            console.log(status)
                            setIsPopoverOpen(false)
                        }} variant="outline">Submit</Button>
                    </div>
                </div>
            </PopoverContent>
       </Popover>
      
    </div>
}

export const individual_request_columns: ColumnDef<Request>[] = [
    {
        accessorKey: "id",
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
        id: "action", 
        header: "Action",
        cell: ({ row }: {row: Row<Request>}) => {
            return <ActionCell row={row} />
        }
    }
]

export const availability_columns: ColumnDef<Availability>[] = [
    {
        accessorKey: "name",
        header: "Employee Name",
    },
    {
        accessorKey: "department",
        header: "Department",
    },  
    {
        accessorKey: "availability",
        header: "Availability",
    },
    {
        accessorKey: "type",
        header: "Type",
    },
    {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
            return <div>
                <Badge className={row.original.isPending ? "bg-yellow-500" : "bg-emerald-500"}>{row.original.isPending ? "Pending" : "Confirmed"}</Badge>
            </div>
        }
    },
]