"use client"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
export const description = "A stacked area chart"

const chartConfig = {
  office: {
    label: "office",
    color: "hsl(var(--accent))",
  },
  wfh: {
    label: "wfh",
    color: "hsl(var(--tertiary))",
  },
} satisfies ChartConfig

interface AvailabilityChartAreaProps {
  chartData: any;
}

export const AvailabilityChartArea = ({chartData}: AvailabilityChartAreaProps) =>  {
  return (

    <div className="max-w-[500px] mx-auto">
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="type"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="office"
              type="natural"
              fill="var(--color-office)"
              fillOpacity={0.4}
              stroke="var(--color-office)"
              stackId="a"
            />
            <Area
              dataKey="wfh"
              type="natural"
              fill="var(--color-wfh)"
              fillOpacity={0.4}
              stroke="var(--color-wfh)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
    </div>
  )
}