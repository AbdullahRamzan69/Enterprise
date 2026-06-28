import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Project } from "./projectTypes"

export interface ProjectsState {
  projects: Project[]
}

export const PROJECTS_STORAGE_KEY = "aethel-ebms-projects"

const initialMockProjects: Project[] = [
  {
    id: "PRJ-2001",
    name: "Chronos Portal v2.0",
    code: "CHR-2026",
    description: "Complete redesign of the internal enterprise portal with modern React architecture and role-based dashboards.",
    client: "Aethel Internal",
    managerId: "EMP-102",
    managerName: "Michael Chen",
    assignedEmployees: ["EMP-102", "EMP-108", "EMP-107"],
    status: "In Progress",
    priority: "High",
    startDate: "2026-01-15",
    endDate: "2026-09-30",
    budget: 320000,
    progress: 62,
  },
  {
    id: "PRJ-2002",
    name: "Nebula CRM Integration",
    code: "NEB-CRM",
    description: "Integrate CRM pipeline data with the EBMS dashboard for unified sales and operations visibility.",
    client: "Astra Corp",
    managerId: "EMP-104",
    managerName: "Robert Frost",
    assignedEmployees: ["EMP-104", "EMP-103", "EMP-105"],
    status: "In Progress",
    priority: "Medium",
    startDate: "2026-03-01",
    endDate: "2026-08-15",
    budget: 185000,
    progress: 45,
  },
  {
    id: "PRJ-2003",
    name: "HR Onboarding Automation",
    code: "HR-ONB",
    description: "Automate employee onboarding workflows including document collection, provisioning, and orientation scheduling.",
    client: "Aethel Internal",
    managerId: "EMP-101",
    managerName: "Sarah Jenkins",
    assignedEmployees: ["EMP-101", "EMP-106"],
    status: "Planning",
    priority: "High",
    startDate: "2026-07-01",
    endDate: "2026-12-31",
    budget: 95000,
    progress: 12,
  },
  {
    id: "PRJ-2004",
    name: "Cloud Infrastructure Migration",
    code: "CLD-MIG",
    description: "Migrate legacy on-premise services to cloud-native infrastructure with zero-downtime deployment strategy.",
    client: "Aethel Internal",
    managerId: "EMP-107",
    managerName: "Marcus Aurelius",
    assignedEmployees: ["EMP-107", "EMP-102"],
    status: "On Hold",
    priority: "High",
    startDate: "2026-02-10",
    endDate: "2026-11-20",
    budget: 410000,
    progress: 28,
  },
  {
    id: "PRJ-2005",
    name: "Q1 Marketing Campaign",
    code: "MKT-Q1",
    description: "Multi-channel marketing campaign for product launch including social, email, and event activations.",
    client: "Aethel Internal",
    managerId: "EMP-103",
    managerName: "Sophia Miller",
    assignedEmployees: ["EMP-103"],
    status: "Completed",
    priority: "Medium",
    startDate: "2026-01-01",
    endDate: "2026-03-31",
    budget: 75000,
    progress: 100,
  },
  {
    id: "PRJ-2006",
    name: "Financial Reporting Suite",
    code: "FIN-RPT",
    description: "Build automated financial reporting dashboards with export capabilities for quarterly board reviews.",
    client: "Aethel Internal",
    managerId: "EMP-105",
    managerName: "David Vance",
    assignedEmployees: ["EMP-105", "EMP-102"],
    status: "In Progress",
    priority: "Medium",
    startDate: "2026-04-01",
    endDate: "2026-10-31",
    budget: 145000,
    progress: 38,
  },
  {
    id: "PRJ-2007",
    name: "Mobile Attendance App",
    code: "ATT-MOB",
    description: "Native mobile application for employee clock-in/out with geofencing and offline sync support.",
    client: "Aethel Internal",
    managerId: "EMP-102",
    managerName: "Michael Chen",
    assignedEmployees: ["EMP-102", "EMP-108"],
    status: "Planning",
    priority: "Low",
    startDate: "2026-08-01",
    endDate: "2027-02-28",
    budget: 210000,
    progress: 5,
  },
  {
    id: "PRJ-2008",
    name: "Vendor Portal Redesign",
    code: "VND-PRT",
    description: "Redesign the external vendor portal for improved procurement workflows and invoice submission.",
    client: "Meridian Supplies",
    managerId: "EMP-107",
    managerName: "Marcus Aurelius",
    assignedEmployees: ["EMP-107", "EMP-104", "EMP-108"],
    status: "In Progress",
    priority: "Medium",
    startDate: "2026-05-15",
    endDate: "2026-11-30",
    budget: 128000,
    progress: 52,
  },
  {
    id: "PRJ-2009",
    name: "Compliance Audit Platform",
    code: "CMP-AUD",
    description: "Centralized platform for tracking regulatory compliance audits, findings, and remediation tasks.",
    client: "Aethel Internal",
    managerId: "EMP-101",
    managerName: "Sarah Jenkins",
    assignedEmployees: ["EMP-101", "EMP-105", "EMP-106"],
    status: "Completed",
    priority: "High",
    startDate: "2025-09-01",
    endDate: "2026-03-15",
    budget: 89000,
    progress: 100,
  },
  {
    id: "PRJ-2010",
    name: "Sales Analytics Dashboard",
    code: "SLS-ANL",
    description: "Real-time sales analytics dashboard with forecasting models and territory performance metrics.",
    client: "Aethel Internal",
    managerId: "EMP-104",
    managerName: "Robert Frost",
    assignedEmployees: ["EMP-104", "EMP-102", "EMP-103"],
    status: "In Progress",
    priority: "High",
    startDate: "2026-02-01",
    endDate: "2026-07-31",
    budget: 165000,
    progress: 71,
  },
  {
    id: "PRJ-2011",
    name: "Legacy System Decommission",
    code: "LEG-DEC",
    description: "Phase out legacy monolith systems and migrate remaining modules to the new microservices architecture.",
    client: "Aethel Internal",
    managerId: "EMP-102",
    managerName: "Michael Chen",
    assignedEmployees: ["EMP-102", "EMP-107"],
    status: "Cancelled",
    priority: "Low",
    startDate: "2025-06-01",
    endDate: "2026-04-30",
    budget: 95000,
    progress: 35,
  },
  {
    id: "PRJ-2012",
    name: "Employee Wellness Program",
    code: "HR-WEL",
    description: "Launch company-wide wellness initiative including fitness tracking, mental health resources, and events.",
    client: "Aethel Internal",
    managerId: "EMP-106",
    managerName: "Emily Blunt",
    assignedEmployees: ["EMP-106", "EMP-101"],
    status: "On Hold",
    priority: "Low",
    startDate: "2026-06-01",
    endDate: "2026-12-15",
    budget: 42000,
    progress: 18,
  },
  {
    id: "PRJ-2013",
    name: "API Gateway Modernization",
    code: "API-GW",
    description: "Replace legacy API gateway with modern rate limiting, authentication, and observability stack.",
    client: "Aethel Internal",
    managerId: "EMP-102",
    managerName: "Michael Chen",
    assignedEmployees: ["EMP-102", "EMP-108", "EMP-107"],
    status: "In Progress",
    priority: "High",
    startDate: "2026-03-20",
    endDate: "2026-09-15",
    budget: 275000,
    progress: 58,
  },
]

const loadInitialProjects = (): Project[] => {
  if (typeof window === "undefined") {
    return initialMockProjects
  }

  const savedProjects = window.localStorage.getItem(PROJECTS_STORAGE_KEY)

  if (!savedProjects) {
    return initialMockProjects
  }

  try {
    return JSON.parse(savedProjects) as Project[]
  } catch {
    return initialMockProjects
  }
}

const initialState: ProjectsState = {
  projects: loadInitialProjects(),
}

const findProject = (state: ProjectsState, id: string) =>
  state.projects.find((project) => project.id === id)

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload)
    },
    updateProject: (
      state,
      action: PayloadAction<{ id: string; updated: Partial<Project> }>
    ) => {
      const project = findProject(state, action.payload.id)

      if (project) {
        Object.assign(project, action.payload.updated)
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((project) => project.id !== action.payload)
    },
    updateProjectProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
      const project = findProject(state, action.payload.id)

      if (!project) {
        return
      }

      const clampedProgress = Math.min(100, Math.max(0, action.payload.progress))
      project.progress = clampedProgress

      if (clampedProgress === 100) {
        project.status = "Completed"
      }
    },
  },
})

export const { addProject, updateProject, deleteProject, updateProjectProgress } =
  projectSlice.actions
export default projectSlice.reducer
