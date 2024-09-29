import { CheckCircledIcon, CrossCircledIcon, QuestionMarkCircledIcon, StopwatchIcon } from "@radix-ui/react-icons";
import { CircleIcon } from "lucide-react";

export const request_status = [
    {
      value: "pending",
      label: "Pending",
      icon: StopwatchIcon,
    },
    {
      value: "approved",
      label: "Approved",
      icon: CheckCircledIcon,
    },
    {
      value: "rejected",
      label: "Rejected",
      icon: CrossCircledIcon,
    },
  ]

export const schedule_status = [
    {
        value: true,
        label: "Pending",
        icon: StopwatchIcon,
    },
    {
      value: false,
      label: "Confirmed",
      icon: CheckCircledIcon,
    },
]


export const availability = [
    {
        value: "office",
        label: "Office",
        icon: CircleIcon,
    },
    {
        value: "WFH",
        label: "WFH",
        icon: CircleIcon,
    }
]

export const department = [
    {
        value: "Sales",
        label: "Sales",
        icon: CircleIcon,
    },
    {
        value: "Marketing",
        label: "Marketing",
        icon: CircleIcon,
    },
    {
        value: "Engineering",
        label: "Engineering",
        icon: CircleIcon,
    },
    
]

export const type = [
    {
        value: "AM",
        label: "AM",
        icon: CircleIcon,
    },
    {
        value: "PM",
        label: "PM",
        icon: CircleIcon,
    },
    
]