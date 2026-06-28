import type { RootState } from "@/app/store"
import type { CandidateStatus } from "./recruitmentTypes"

export const selectCandidates = (state: RootState) => state.recruitment.candidates

export const selectCandidateById = (state: RootState, id: string) =>
  selectCandidates(state).find((candidate) => candidate.id === id)

export const selectCandidateCountByStatus = (state: RootState, status: CandidateStatus) =>
  selectCandidates(state).filter((candidate) => candidate.status === status).length

export const selectTotalCandidates = (state: RootState) => selectCandidates(state).length
