import { useAppSelector } from "@/app/store"
import { selectEmployees } from "@/features/employees/employeeSelectors"
import { Cake, Briefcase, CalendarDays, Clock, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

// intentionally prop-free: derives all data from Redux

interface EventItem {
  id: string
  type: "birthday" | "contract" | "probation" | "project" | "holiday"
  title: string
  date: string // YYYY-MM-DD
  daysAway: number
}

function addMonths(dateStr: string, months: number): string {
  const d = new Date(`${dateStr}T00:00:00`)
  d.setMonth(d.getMonth() + months)
  return d.toISOString().split("T")[0]
}

function addYears(dateStr: string, years: number): string {
  const d = new Date(`${dateStr}T00:00:00`)
  d.setFullYear(d.getFullYear() + years)
  return d.toISOString().split("T")[0]
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0]
}

function daysFromToday(dateStr: string): number {
  const today = new Date(todayStr() + "T00:00:00")
  const target = new Date(dateStr + "T00:00:00")
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}

function nextOccurrence(mmdd: string): string {
  // mmdd = "MM-DD" from dateOfBirth
  const today = todayStr()
  const year = today.slice(0, 4)
  let candidate = `${year}-${mmdd}`
  if (candidate < today) {
    candidate = `${parseInt(year) + 1}-${mmdd}`
  }
  return candidate
}

const TYPE_CONFIG = {
  birthday: { icon: Cake, label: "Birthday" },
  contract: { icon: Briefcase, label: "Contract End" },
  probation: { icon: Clock, label: "Probation End" },
  project: { icon: CalendarDays, label: "Project Deadline" },
  holiday: { icon: Sun, label: "Holiday" },
}

function relativeLabel(days: number): string {
  if (days === 0) return "Today"
  if (days === 1) return "in 1 day"
  return `in ${days} days`
}

export function UpcomingEvents() {
  const employees = useAppSelector(selectEmployees)

  const today = todayStr()
  const cutoff = (() => {
    const d = new Date(today + "T00:00:00")
    d.setDate(d.getDate() + 30)
    return d.toISOString().split("T")[0]
  })()

  const events: EventItem[] = []

  for (const emp of employees) {
    // Birthdays — Employee type has no dateOfBirth; skip gracefully if absent
    const dob = (emp as unknown as { dateOfBirth?: string }).dateOfBirth
    if (dob) {
      const mmdd = dob.slice(5) // "MM-DD"
      const nextBirthday = nextOccurrence(mmdd)
      if (nextBirthday >= today && nextBirthday <= cutoff) {
        events.push({
          id: `bday-${emp.id}`,
          type: "birthday",
          title: `${emp.fullName}'s Birthday`,
          date: nextBirthday,
          daysAway: daysFromToday(nextBirthday),
        })
      }
    }

    // Contract expiration: 1 year after joiningDate for Contract employees
    if (emp.employmentType === "Contract") {
      const contractEnd = addYears(emp.joiningDate, 1)
      if (contractEnd >= today && contractEnd <= cutoff) {
        events.push({
          id: `contract-${emp.id}`,
          type: "contract",
          title: `${emp.fullName} Contract Expires`,
          date: contractEnd,
          daysAway: daysFromToday(contractEnd),
        })
      }
    }

    // Probation end: 3 months after joiningDate for Full-time / Part-time
    if (emp.employmentType === "Full-time" || emp.employmentType === "Part-time") {
      const probationEnd = addMonths(emp.joiningDate, 3)
      if (probationEnd >= today && probationEnd <= cutoff) {
        events.push({
          id: `probation-${emp.id}`,
          type: "probation",
          title: `${emp.fullName} Probation Ends`,
          date: probationEnd,
          daysAway: daysFromToday(probationEnd),
        })
      }
    }
  }

  // Sort soonest first
  events.sort((a, b) => a.date.localeCompare(b.date))

  return (
    <section className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full">
      <h2 className="text-base font-semibold text-foreground mb-1">Upcoming Events</h2>
      <p className="text-xs text-muted-foreground mb-4">Next 30 days</p>

      {events.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          No upcoming events in the next 30 days.
        </div>
      ) : (
        <ul className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-64">
          {events.map((event) => {
            const cfg = TYPE_CONFIG[event.type]
            const Icon = cfg.icon
            const labelColor =
              event.daysAway === 0
                ? "text-red-500"
                : event.daysAway <= 7
                ? "text-amber-500"
                : "text-muted-foreground"

            return (
              <li key={event.id} className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted shrink-0">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{event.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {new Date(event.date + "T00:00:00").toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span className={cn("text-[10px] font-semibold shrink-0", labelColor)}>
                  {relativeLabel(event.daysAway)}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
