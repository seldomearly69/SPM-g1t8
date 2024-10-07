"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/data-table"
import { request_columns } from "@/components/columns"
import { useRouter } from 'next/navigation'
import { User } from "@/types"

// Mock data - replace with actual API call
const mockEmployeeRequests = [
    { requestId: 1, employeeName: "Alice Johnson", department: "Engineering", date: "2023-05-23", type: "AM", requestedOn: "2023-05-19",  status: "pending", remarks: "need to wfh" },
    { requestId: 2, employeeName: "Bob Smith", department: "Engineering", date: "2023-06-23", type: "AM", requestedOn: "2023-05-30", status: "pending", remarks: "need to wfh" },
    { requestId: 3, employeeName: "Charlie Brown", department: "Engineering", date: "2023-07-23", type: "AM", requestedOn: "2023-07-14",  status: "pending", remarks: "No remarks" },
  ]

interface ManageEmployeeArrangementsProps { 
    user: User
}

export default function ManageEmployeeArrangements({user}: ManageEmployeeArrangementsProps) {
  const [employeeRequests, setEmployeeRequests] = useState(mockEmployeeRequests)
  const router = useRouter()

  useEffect(() => {
    // TODO: Fetch actual employee requests data from API
    // setEmployeeRequests(await fetchEmployeeRequests())
  }, [])

  

  const handleRowClick = (row: any) => {
    router.push(`/dashboard/manage-employees/${row.id}`)
  }


  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6" >Manage Employee WFH Requests</h2>

      <DataTable columns={request_columns} data={employeeRequests } onRowClick={handleRowClick} />
      
    </div>
  )
}