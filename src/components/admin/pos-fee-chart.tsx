"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface PosFeeChartProps {
  data: Array<{ date: string; fees: number }>;
}

export function PosFeeChart({ data }: PosFeeChartProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>POS Fees Collected</CardTitle>
        <CardDescription>Total POS fees collected over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            fees: {
              label: "POS Fees (PKR)",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorFees" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-fees)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-fees)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="fees"
                stroke="var(--color-fees)"
                fillOpacity={1}
                fill="url(#colorFees)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
