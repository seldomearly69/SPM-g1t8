"use client"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
export const description = "A stacked bar chart with a legend"

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

interface AvailabilityChartProps {
  chartData: any;
}

export const AvailabilityChart = ({chartData}: AvailabilityChartProps) =>  {
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