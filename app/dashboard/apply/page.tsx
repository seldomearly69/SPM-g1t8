"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


export default function ApplyWFHPage() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")
  const [type, setType] = useState("full-time")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement submission logic
    console.log({ startDate, endDate, reason, type })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Apply for Work From Home</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="start-date" className="block mb-2">Start Date</label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block mb-2">End Date</label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="type" className="block mb-2">WFH Type</label>
          {/* <Select
            id="type"
            value={type}
            onValueChange={setType}
          >
            <Select.Option value="full-time">Full-time</Select.Option>
            <Select.Option value="part-time">Part-time</Select.Option>
            <Select.Option value="flexible">Flexible</Select.Option>
          </Select> */}
        </div>
        <div>
          <label htmlFor="reason" className="block mb-2">Reason for WFH Request</label>
          {/* <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            required
          /> */}
        </div>
        <Button type="submit">Submit Application</Button>
      </form>
    </div>
  )
}