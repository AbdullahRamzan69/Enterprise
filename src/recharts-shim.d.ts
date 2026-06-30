// Shim to work around recharts@3.x empty types/index.d.ts barrel file.
// The runtime module works correctly; this gives TypeScript enough to compile.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare module "recharts" {
  import * as React from "react"

  type RechartsComponentProps = Record<string, unknown> & {
    children?: React.ReactNode
  }

  export const AreaChart: React.FC<RechartsComponentProps>
  export const BarChart: React.FC<RechartsComponentProps>
  export const LineChart: React.FC<RechartsComponentProps>
  export const PieChart: React.FC<RechartsComponentProps>
  export const ComposedChart: React.FC<RechartsComponentProps>
  export const Area: React.FC<RechartsComponentProps>
  export const Bar: React.FC<RechartsComponentProps>
  export const Line: React.FC<RechartsComponentProps>
  export const Pie: React.FC<RechartsComponentProps>
  export const Cell: React.FC<RechartsComponentProps>
  export const XAxis: React.FC<RechartsComponentProps>
  export const YAxis: React.FC<RechartsComponentProps>
  export const CartesianGrid: React.FC<RechartsComponentProps>
  export const Tooltip: React.FC<RechartsComponentProps>
  export const Legend: React.FC<RechartsComponentProps>
  export const ResponsiveContainer: React.FC<RechartsComponentProps>
}
