export type CandidateStatus =
  | "Applied"
  | "Screening"
  | "Interview Scheduled"
  | "Interviewed"
  | "Selected"
  | "Rejected"

export interface Candidate {
  id: string
  fullName: string
  email: string
  phone: string
  position: string
  department: string
  experience: number
  expectedSalary: number
  appliedDate: string
  interviewDate?: string
  interviewer?: string
  status: CandidateStatus
  notes: string
}

export const CANDIDATE_STATUSES: CandidateStatus[] = [
  "Applied",
  "Screening",
  "Interview Scheduled",
  "Interviewed",
  "Selected",
  "Rejected",
]

export const DEPARTMENTS = ["HR", "Engineering", "Marketing", "Sales", "Finance", "Operations"]

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

export const isValidPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "")
  return digits.length >= 10 && digits.length <= 15
}
