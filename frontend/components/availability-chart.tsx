"use client"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
export const description = "A stacked bar chart with a legend"
const chartData = [
  { availability: "Office", PM: 186, AM: 80 },
  { availability: "WFH", PM: 305, AM: 200 },
  
]
const chartConfig = {
  PM: {
    label: "PM",
    color: "green",
  },
  AM: {
    label: "AM",
    color: "red",
  },
} satisfies ChartConfig

export const AvailabilityChart = () =>  {
  return (
    <div className="max-w-[500px] mx-auto">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="availability"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => value}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="PM"
              stackId="a"
              fill="green"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="AM"
              stackId="a"
              fill="red"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
    </div>
  )
}