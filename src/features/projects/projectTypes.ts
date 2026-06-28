import { isEndDateBeforeStartDate } from "@/features/leave/leaveTypes"

export type ProjectStatus = "Planning" | "In Progress" | "On Hold" | "Completed" | "Cancelled"
export type ProjectPriority = "Low" | "Medium" | "High"

export interface Project {
  id: string
  name: string
  code: string
  description: string
  client: string
  managerId: string
  managerName: string
  assignedEmployees: string[]
  status: ProjectStatus
  priority: ProjectPriority
  startDate: string
  endDate: string
  budget: number
  progress: number
}

export const PROJECT_STATUSES: ProjectStatus[] = [
  "Planning",
  "In Progress",
  "On Hold",
  "Completed",
  "Cancelled",
]

export const PROJECT_PRIORITIES: ProjectPriority[] = ["Low", "Medium", "High"]

export const isEndDateBeforeStart = isEndDateBeforeStartDate

export const isProjectCodeUnique = (code: string, projects: Project[], excludeId?: string) =>
  !projects.some(
    (project) => project.code.toLowerCase() === code.trim().toLowerCase() && project.id !== excludeId
  )
