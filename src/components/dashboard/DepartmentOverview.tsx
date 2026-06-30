import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { useAppSelector } from "@/app/store"
import { selectEmployees } from "@/features/employees/employeeSelectors"

// intentionally prop-free: derives all data from Redux

const PALETTE = [
  "#2563EB", "#10B981", "#F59E0B", "#EF4444",
  "#8B5CF6", "#EC4899", "#06B6D4", "#F97316",
]

interface TooltipPayload {
  name?: string
  value?: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card border border-border rounded-xl shadow-xl px-3 py-2 text-xs">
      <p className="font-semibold text-foreground">{payload[0].name}</p>
      <p className="text-muted-foreground mt-0.5">{payload[0].value} employees</p>
    </div>
  )
}

export function DepartmentOverview() {
  const employees = useAppSelector(selectEmployees)
  const active = employees.filter((e) => e.status === "Active")

  // Group by department
  const counts: Record<string, number> = {}
  for (const emp of active) {
    counts[emp.department] = (counts[emp.department] ?? 0) + 1
  }
  const data = Object.entries(counts).map(([name, value]) => ({ name, value }))

  return (
    <section className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full">
      <h2 className="text-base font-semibold text-foreground mb-1">Department Overview</h2>
      <p className="text-xs text-muted-foreground mb-4">Active workforce by department</p>

      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          No active employees found.
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-full sm:w-48 shrink-0">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  isAnimationActive={true}
                  animationDuration={800}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={index}
                      fill={PALETTE[index % PALETTE.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <ul className="flex flex-col gap-2 flex-1 min-w-0">
            {data.map((entry, index) => (
              <li key={entry.name} className="flex items-center gap-2 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: PALETTE[index % PALETTE.length] }}
                />
                <span className="text-foreground font-medium truncate flex-1">{entry.name}</span>
                <span className="text-muted-foreground tabular-nums">{entry.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
