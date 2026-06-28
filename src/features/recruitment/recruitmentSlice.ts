import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Candidate } from "./recruitmentTypes"

export interface RecruitmentState {
  candidates: Candidate[]
}

export const RECRUITMENT_STORAGE_KEY = "aethel-ebms-recruitment"

const initialMockCandidates: Candidate[] = [
  {
    id: "CAN-1001",
    fullName: "Alexandra Rivera",
    email: "alexandra.rivera@email.com",
    phone: "+1 (555) 101-2001",
    position: "Senior React Developer",
    department: "Engineering",
    experience: 6,
    expectedSalary: 125000,
    appliedDate: "2026-06-01",
    status: "Interview Scheduled",
    interviewDate: "2026-06-28",
    interviewer: "Michael Chen",
    notes: "Strong portfolio with enterprise SaaS experience. Recommended for technical round.",
  },
  {
    id: "CAN-1002",
    fullName: "James Okafor",
    email: "james.okafor@email.com",
    phone: "+1 (555) 101-2002",
    position: "Product Manager",
    department: "Engineering",
    experience: 8,
    expectedSalary: 135000,
    appliedDate: "2026-06-03",
    status: "Screening",
    notes: "Previously led cross-functional teams at a fintech startup.",
  },
  {
    id: "CAN-1003",
    fullName: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+1 (555) 101-2003",
    position: "UX Designer",
    department: "Engineering",
    experience: 4,
    expectedSalary: 92000,
    appliedDate: "2026-06-05",
    status: "Applied",
    notes: "Submitted case study for dashboard redesign project.",
  },
  {
    id: "CAN-1004",
    fullName: "Daniel Kim",
    email: "daniel.kim@email.com",
    phone: "+1 (555) 101-2004",
    position: "DevOps Engineer",
    department: "Engineering",
    experience: 5,
    expectedSalary: 118000,
    appliedDate: "2026-05-28",
    status: "Interviewed",
    interviewDate: "2026-06-20",
    interviewer: "Marcus Aurelius",
    notes: "Excellent Kubernetes and CI/CD knowledge. Awaiting final decision.",
  },
  {
    id: "CAN-1005",
    fullName: "Emma Thompson",
    email: "emma.thompson@email.com",
    phone: "+1 (555) 101-2005",
    position: "Marketing Coordinator",
    department: "Marketing",
    experience: 3,
    expectedSalary: 58000,
    appliedDate: "2026-06-08",
    status: "Applied",
    notes: "Referral from Sophia Miller. Strong content marketing background.",
  },
  {
    id: "CAN-1006",
    fullName: "Carlos Mendez",
    email: "carlos.mendez@email.com",
    phone: "+1 (555) 101-2006",
    position: "Account Executive",
    department: "Sales",
    experience: 7,
    expectedSalary: 95000,
    appliedDate: "2026-05-20",
    status: "Selected",
    interviewDate: "2026-06-10",
    interviewer: "Robert Frost",
    notes: "Exceeded sales targets for three consecutive years. Offer letter pending.",
  },
  {
    id: "CAN-1007",
    fullName: "Hannah Wright",
    email: "hannah.wright@email.com",
    phone: "+1 (555) 101-2007",
    position: "Financial Analyst",
    department: "Finance",
    experience: 4,
    expectedSalary: 78000,
    appliedDate: "2026-06-02",
    status: "Screening",
    notes: "CPA candidate with strong Excel and forecasting skills.",
  },
  {
    id: "CAN-1008",
    fullName: "Omar Hassan",
    email: "omar.hassan@email.com",
    phone: "+1 (555) 101-2008",
    position: "Backend Developer",
    department: "Engineering",
    experience: 5,
    expectedSalary: 110000,
    appliedDate: "2026-05-15",
    status: "Rejected",
    interviewDate: "2026-05-30",
    interviewer: "Michael Chen",
    notes: "Technical assessment below threshold for senior role requirements.",
  },
  {
    id: "CAN-1009",
    fullName: "Lisa Nakamura",
    email: "lisa.nakamura@email.com",
    phone: "+1 (555) 101-2009",
    position: "HR Generalist",
    department: "HR",
    experience: 6,
    expectedSalary: 72000,
    appliedDate: "2026-06-10",
    status: "Applied",
    notes: "SHRM certified with experience in employee relations and onboarding.",
  },
  {
    id: "CAN-1010",
    fullName: "Ryan Cooper",
    email: "ryan.cooper@email.com",
    phone: "+1 (555) 101-2010",
    position: "Operations Analyst",
    department: "Operations",
    experience: 3,
    expectedSalary: 68000,
    appliedDate: "2026-06-04",
    status: "Interview Scheduled",
    interviewDate: "2026-06-27",
    interviewer: "Marcus Aurelius",
    notes: "Process optimization focus with Lean Six Sigma Green Belt.",
  },
  {
    id: "CAN-1011",
    fullName: "Nina Patel",
    email: "nina.patel@email.com",
    phone: "+1 (555) 101-2011",
    position: "Data Scientist",
    department: "Engineering",
    experience: 4,
    expectedSalary: 115000,
    appliedDate: "2026-05-25",
    status: "Interviewed",
    interviewDate: "2026-06-18",
    interviewer: "Michael Chen",
    notes: "Strong Python and ML pipeline experience. Culture fit confirmed.",
  },
  {
    id: "CAN-1012",
    fullName: "Thomas Berger",
    email: "thomas.berger@email.com",
    phone: "+1 (555) 101-2012",
    position: "Sales Development Rep",
    department: "Sales",
    experience: 2,
    expectedSalary: 55000,
    appliedDate: "2026-06-12",
    status: "Applied",
    notes: "Recent graduate with internship experience in B2B outbound sales.",
  },
  {
    id: "CAN-1013",
    fullName: "Maria Gonzalez",
    email: "maria.gonzalez@email.com",
    phone: "+1 (555) 101-2013",
    position: "Content Strategist",
    department: "Marketing",
    experience: 5,
    expectedSalary: 82000,
    appliedDate: "2026-06-06",
    status: "Screening",
    notes: "Managed editorial calendar for a national consumer brand.",
  },
  {
    id: "CAN-1014",
    fullName: "Kevin Zhang",
    email: "kevin.zhang@email.com",
    phone: "+1 (555) 101-2014",
    position: "QA Engineer",
    department: "Engineering",
    experience: 4,
    expectedSalary: 88000,
    appliedDate: "2026-05-18",
    status: "Rejected",
    interviewDate: "2026-06-05",
    interviewer: "Clara Oswald",
    notes: "Insufficient automation testing experience for the role.",
  },
  {
    id: "CAN-1015",
    fullName: "Sophie Laurent",
    email: "sophie.laurent@email.com",
    phone: "+1 (555) 101-2015",
    position: "Talent Acquisition Specialist",
    department: "HR",
    experience: 5,
    expectedSalary: 70000,
    appliedDate: "2026-06-09",
    status: "Interview Scheduled",
    interviewDate: "2026-06-29",
    interviewer: "Sarah Jenkins",
    notes: "Experienced in tech recruiting with strong ATS proficiency.",
  },
  {
    id: "CAN-1016",
    fullName: "Benjamin Cole",
    email: "benjamin.cole@email.com",
    phone: "+1 (555) 101-2016",
    position: "Facilities Coordinator",
    department: "Operations",
    experience: 3,
    expectedSalary: 52000,
    appliedDate: "2026-06-11",
    status: "Applied",
    notes: "Vendor management and workplace safety certification on file.",
  },
  {
    id: "CAN-1017",
    fullName: "Aisha Mohammed",
    email: "aisha.mohammed@email.com",
    phone: "+1 (555) 101-2017",
    position: "Junior Developer",
    department: "Engineering",
    experience: 1,
    expectedSalary: 65000,
    appliedDate: "2026-06-14",
    status: "Selected",
    interviewDate: "2026-06-22",
    interviewer: "Michael Chen",
    notes: "Outstanding coding challenge score. Ready for onboarding.",
  },
  {
    id: "CAN-1018",
    fullName: "Patrick O'Brien",
    email: "patrick.obrien@email.com",
    phone: "+1 (555) 101-2018",
    position: "Controller",
    department: "Finance",
    experience: 10,
    expectedSalary: 145000,
    appliedDate: "2026-05-10",
    status: "Interviewed",
    interviewDate: "2026-06-15",
    interviewer: "David Vance",
    notes: "Deep ERP and compliance experience. Final round with leadership scheduled.",
  },
]

const loadInitialCandidates = (): Candidate[] => {
  if (typeof window === "undefined") {
    return initialMockCandidates
  }

  const savedCandidates = window.localStorage.getItem(RECRUITMENT_STORAGE_KEY)

  if (!savedCandidates) {
    return initialMockCandidates
  }

  try {
    return JSON.parse(savedCandidates) as Candidate[]
  } catch {
    return initialMockCandidates
  }
}

const initialState: RecruitmentState = {
  candidates: loadInitialCandidates(),
}

const findCandidate = (state: RecruitmentState, id: string) =>
  state.candidates.find((candidate) => candidate.id === id)

const recruitmentSlice = createSlice({
  name: "recruitment",
  initialState,
  reducers: {
    addCandidate: (state, action: PayloadAction<Candidate>) => {
      state.candidates.push(action.payload)
    },
    updateCandidate: (
      state,
      action: PayloadAction<{ id: string; updated: Partial<Candidate> }>
    ) => {
      const candidate = findCandidate(state, action.payload.id)

      if (candidate) {
        Object.assign(candidate, action.payload.updated)
      }
    },
    deleteCandidate: (state, action: PayloadAction<string>) => {
      state.candidates = state.candidates.filter((candidate) => candidate.id !== action.payload)
    },
    moveToScreening: (state, action: PayloadAction<string>) => {
      const candidate = findCandidate(state, action.payload)

      if (candidate && candidate.status === "Applied") {
        candidate.status = "Screening"
      }
    },
    moveToInterviewScheduled: (
      state,
      action: PayloadAction<{ id: string; interviewDate: string; interviewer: string }>
    ) => {
      const candidate = findCandidate(state, action.payload.id)

      if (candidate && candidate.status === "Screening") {
        candidate.status = "Interview Scheduled"
        candidate.interviewDate = action.payload.interviewDate
        candidate.interviewer = action.payload.interviewer
      }
    },
    moveToInterviewed: (state, action: PayloadAction<string>) => {
      const candidate = findCandidate(state, action.payload)

      if (candidate && candidate.status === "Interview Scheduled") {
        candidate.status = "Interviewed"
      }
    },
    selectCandidate: (state, action: PayloadAction<string>) => {
      const candidate = findCandidate(state, action.payload)

      if (candidate && candidate.status === "Interviewed") {
        candidate.status = "Selected"
      }
    },
    rejectCandidate: (state, action: PayloadAction<string>) => {
      const candidate = findCandidate(state, action.payload)

      if (candidate && candidate.status === "Interviewed") {
        candidate.status = "Rejected"
      }
    },
  },
})

export const {
  addCandidate,
  updateCandidate,
  deleteCandidate,
  moveToScreening,
  moveToInterviewScheduled,
  moveToInterviewed,
  selectCandidate,
  rejectCandidate,
} = recruitmentSlice.actions
export default recruitmentSlice.reducer
