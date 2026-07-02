import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  JobApplicant,
  JobOpening,
  JobsState,
  JobPermission,
} from "./jobTypes";
import { duplicateJobTitle } from "./jobUtils";

export const JOBS_STORAGE_KEY = "aethel-ebms-jobs-v2";

const CURRENT_USER_PERMISSIONS: JobPermission[] = [
  "jobs.view",
  "jobs.create",
  "jobs.edit",
  "jobs.delete",
  "jobs.publish",
  "jobs.archive",
  "jobs.manageApplicants",
];

const createMockState = (): JobsState => ({
  jobs: [],
  applicants: [],
  currentUserPermissions: CURRENT_USER_PERMISSIONS,
});

const loadInitialState = (): JobsState => {
  const baseState = createMockState();

  if (typeof window === "undefined") {
    return baseState;
  }

  const stored = window.localStorage.getItem(JOBS_STORAGE_KEY);
  if (!stored) {
    return baseState;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<JobsState>;
    return {
      ...baseState,
      ...parsed,
      jobs: parsed.jobs ?? baseState.jobs,
      applicants: parsed.applicants ?? baseState.applicants,
      currentUserPermissions:
        parsed.currentUserPermissions ?? baseState.currentUserPermissions,
    };
  } catch {
    return baseState;
  }
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState: loadInitialState(),
  reducers: {
    createJob: (state, action: PayloadAction<JobOpening>) => {
      state.jobs.unshift(action.payload);
    },
    updateJob: (state, action: PayloadAction<JobOpening>) => {
      const index = state.jobs.findIndex((job) => job.id === action.payload.id);
      if (index !== -1) {
        state.jobs[index] = action.payload;
      }
    },
    publishJob: (state, action: PayloadAction<string>) => {
      const today = new Date().toISOString().split("T")[0];
      state.jobs = state.jobs.map((job) =>
        job.id === action.payload
          ? {
              ...job,
              status: "Published",
              publishedDate: job.publishedDate ?? today,
              updatedAt: today,
            }
          : job,
      );
    },
    archiveJob: (state, action: PayloadAction<string>) => {
      const today = new Date().toISOString().split("T")[0];
      state.jobs = state.jobs.map((job) =>
        job.id === action.payload
          ? {
              ...job,
              status: "Archived",
              updatedAt: today,
            }
          : job,
      );
    },
    closeJob: (state, action: PayloadAction<string>) => {
      const today = new Date().toISOString().split("T")[0];
      state.jobs = state.jobs.map((job) =>
        job.id === action.payload
          ? {
              ...job,
              status: "Closed",
              closingDate: today,
              updatedAt: today,
            }
          : job,
      );
    },
    deleteJob: (state, action: PayloadAction<string>) => {
      state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      state.applicants = state.applicants.filter(
        (applicant) => applicant.jobId !== action.payload,
      );
    },
    duplicateJob: (state, action: PayloadAction<string>) => {
      const source = state.jobs.find((job) => job.id === action.payload);
      if (!source) return;

      const ids = state.jobs
        .map((job) => parseInt(job.id.replace("JOB-", ""), 10))
        .filter((value) => !Number.isNaN(value));
      const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1001;

      state.jobs.unshift({
        ...source,
        id: `JOB-${nextId}`,
        title: duplicateJobTitle(source.title),
        status: "Draft",
        publishedDate: null,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      });
    },
    updateApplicantStatus: (
      state,
      action: PayloadAction<{ id: string; status: JobApplicant["status"] }>,
    ) => {
      const applicant = state.applicants.find(
        (item) => item.id === action.payload.id,
      );
      if (applicant) {
        applicant.status = action.payload.status;
      }
    },
    setCurrentJobPermissions: (
      state,
      action: PayloadAction<JobPermission[]>,
    ) => {
      state.currentUserPermissions = action.payload;
    },
  },
});

export const {
  createJob,
  updateJob,
  publishJob,
  archiveJob,
  closeJob,
  deleteJob,
  duplicateJob,
  updateApplicantStatus,
  setCurrentJobPermissions,
} = jobsSlice.actions;

export default jobsSlice.reducer;
