import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { ApplicantStatus, JobPermission, JobStatus } from "./jobTypes";

export const selectJobsState = (state: RootState) => state.jobs;

export const selectJobOpenings = createSelector(
  [selectJobsState],
  (jobsState) => jobsState.jobs,
);

export const selectJobApplicants = createSelector(
  [selectJobsState],
  (jobsState) => jobsState.applicants,
);

export const selectCurrentJobPermissions = createSelector(
  [selectJobsState],
  (jobsState) => jobsState.currentUserPermissions,
);

export const selectCanManageJobPermission = createSelector(
  [
    selectCurrentJobPermissions,
    (_state: RootState, permission: JobPermission) => permission,
  ],
  (permissions, permission) => permissions.includes(permission),
);

export const selectJobById = createSelector(
  [selectJobOpenings, (_state: RootState, id: string) => id],
  (jobs, id) => jobs.find((job) => job.id === id),
);

export const selectApplicantsByJobId = createSelector(
  [selectJobApplicants, (_state: RootState, jobId: string) => jobId],
  (applicants, jobId) =>
    applicants.filter((applicant) => applicant.jobId === jobId),
);

export const selectApplicantById = createSelector(
  [selectJobApplicants, (_state: RootState, id: string) => id],
  (applicants, id) => applicants.find((applicant) => applicant.id === id),
);

export const selectJobCountByStatus = createSelector(
  [selectJobOpenings, (_state: RootState, status: JobStatus) => status],
  (jobs, status) => jobs.filter((job) => job.status === status).length,
);

export const selectApplicantsCountByStatus = createSelector(
  [selectJobApplicants, (_state: RootState, status: ApplicantStatus) => status],
  (applicants, status) =>
    applicants.filter((applicant) => applicant.status === status).length,
);

export const selectTotalApplications = createSelector(
  [selectJobApplicants],
  (applicants) => applicants.length,
);
