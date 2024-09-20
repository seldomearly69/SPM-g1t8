import { CheckCircledIcon, CrossCircledIcon, QuestionMarkCircledIcon, StopwatchIcon } from "@radix-ui/react-icons";
import { CircleIcon } from "lucide-react";

export const statuses = [
    {
      value: "backlog",
      label: "Backlog",
      icon: QuestionMarkCircledIcon,
    },
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