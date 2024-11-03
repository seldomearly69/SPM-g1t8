import {
  CheckCircledIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { CircleIcon, HouseIcon, SchoolIcon } from "lucide-react";

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
];

export const schedule_status = [
  {
    value: "pending",
    label: "pending",
    icon: StopwatchIcon,
  },
  {
    value: "approved",
    label: "approved",
    icon: CheckCircledIcon,
  },
  {
    value: "rejected",
    label: "rejected",
    icon: CrossCircledIcon,
  },
];

export const availability = [
  {
    value: "office",
    label: "Office",
    icon: SchoolIcon,
  },
  {
    value: "wfh",
    label: "WFH",
    icon: HouseIcon,
  },
];

export const department = [
  {
    value: "Sales",
    label: "Sales",
    icon: CircleIcon,
  },
  {
    value: "Engineering",
    label: "Engineering",
    icon: CircleIcon,
  },
  {
    value: "Solutioning",
    label: "Solutioning",
    icon: CircleIcon,
  },
  {
    value: "IT",
    label: "IT",
    icon: CircleIcon,
  },
  {
    value: "HR",
    label: "HR",
    icon: CircleIcon,
  },
  {
    value: "Finance",
    label: "Finance",
    icon: CircleIcon,
  },
  {
    value: "Consultancy",
    label: "Consultancy",
    icon: CircleIcon,
  },
];

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
];
