import { twMerge } from "tailwind-merge";
import { DaysInWeekProps } from "@/types";
import { enUS } from "date-fns/locale";
import { ClassValue, clsx } from "clsx";
import { getWeek, getYear } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const daysInWeek = ({ locale = enUS }: DaysInWeekProps) => [
  { day: 0, label: locale.localize?.day(0) },
  { day: 1, label: locale.localize?.day(1) },
  { day: 2, label: locale.localize?.day(2) },
  { day: 3, label: locale.localize?.day(3) },
  { day: 4, label: locale.localize?.day(4) },
  { day: 5, label: locale.localize?.day(5) },
  { day: 6, label: locale.localize?.day(6) },
];

export const hasMoreThanTwoDays = (dates: {date: Date, type: string}[]) => {
  const weekMap = new Map<string, number>()
  const uniqueDates = new Set<string>()

  dates.forEach(({date}) => {
    uniqueDates.add(date.toISOString())
  })
  
  uniqueDates.forEach((date) => {
    const weekKey = `${getYear(date)}-${getWeek(date)}`
    weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + 1)
  })

  for (const count of weekMap.values()) {
    if (count > 2) {
      return true
    }
  }

  return false
}
