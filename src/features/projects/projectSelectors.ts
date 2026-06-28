import type { RootState } from "@/app/store"
import type { ProjectStatus } from "./projectTypes"

export const selectProjects = (state: RootState) => state.projects.projects

export const selectProjectById = (state: RootState, id: string) =>
  selectProjects(state).find((project) => project.id === id)

export const selectProjectsByEmployeeId = (state: RootState, employeeId: string) =>
  selectProjects(state).filter(
    (project) =>
      project.managerId === employeeId || project.assignedEmployees.includes(employeeId)
  )

export const selectTotalProjects = (state: RootState) => selectProjects(state).length

export const selectProjectCountByStatus = (state: RootState, status: ProjectStatus) =>
  selectProjects(state).filter((project) => project.status === status).length

export const selectActiveProjectsCount = (state: RootState) =>
  selectProjectCountByStatus(state, "In Progress")
