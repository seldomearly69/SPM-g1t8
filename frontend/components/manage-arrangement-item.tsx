"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { IndividualRequest } from "@/types"
import { getIndividualRequest, withdrawRequest } from "@/service/request"
import { User } from "@/types"
import { Popover } from "@radix-ui/react-popover"
import { PopoverContent, PopoverTrigger } from "./ui/popover"
import { useRouter } from "next/navigation"


interface ManageIndividualRequestProps {
    user: User;
    params: { request_id: string };
}

export default function ManageIndividualRequest({ user, params }: ManageIndividualRequestProps) {
    const [request, setRequest] = useState<IndividualRequest>()
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [reason, setReason] = useState('');
    const router = useRouter()



    const handleWithdraw = async () => {
        // const data = await withdrawRequest(request.requestId, reason)
        console.log(request?.requestId, reason);
        
    }

    useEffect(() => {
      
        const fetchData = async () => {
            const data = await getIndividualRequest(parseInt(params.request_id))
            console.log(data);
            setRequest(data.data.request)
            
        }
        fetchData()
        
    }, [params.request_id])
  
    if (!request) return <div>Loading...</div>

    return (
        
        <div className="max-w-3xl mx-auto p-6">

          <h1 className="text-2xl font-bold mb-6">WFH Request #{params.request_id}</h1>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" value={request?.date} readOnly />
            </div>
            <div>
              <Label htmlFor="requested-on">Requested on</Label>
              <Input id="requested-on" value={request.requested_on} readOnly />
            </div>
            <div>
                <Label htmlFor="request-type">Request Type</Label>
                <Input id="request-type" value={request?.type} readOnly />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Input id="status" value={request?.status} readOnly />
            </div>
            <div className="col-span-2">
              <Label className="block mb-2">Remarks</Label>
              <Textarea
                value={request?.remarks}
               
                rows={4}
              />
            </div>
          </div>
        
       
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <div className="mt-6 flex justify-between space-x-4">
                <Button variant="outline" onClick={() => router.back()}>Back</Button>
                {request?.status == "approved" ? (
                <PopoverTrigger asChild>
                    <Button  size="sm" className="hover:text-red-500"> 
                    Withdraw 
                </Button>
                </PopoverTrigger>
                ) : request?.status == "pending" ? (
                    <Button variant="outline">Withdraw</Button>
                ) : null }
            </div>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Reason</h4>
                            <p className="text-sm text-muted-foreground">
                            Enter the reason for the withdrawal
                            </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                        <Textarea
                            onChange={(e) => setReason(e.target.value)}
                            className="col-span-3 h-8"
                        />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Button onClick={() =>{
                            handleWithdraw()
                            setIsPopoverOpen(false)
                        }} variant="outline">Submit</Button>
                    </div>
                </div>
            </PopoverContent>
            </Popover>
            <div>
       
          </div>
        </div>
      )
}