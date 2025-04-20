import { Department } from './department';

export type JobPostingOrNull = JobPosting | null;

export interface JobPosting extends JobPostingBase {
  id: number;
}

export interface JobPostingNew extends JobPostingBase {
  id?: number;
}

export interface JobPostingBase {
  title: string;
  description: string;
  department: Department;
  status: JobPostingStatus;
  note?: string;
}

export enum JobPostingStatus {
  DRAFT,
  QA,
  PUBLISHED,
  SCREENING_OF_APPLICATIONS,
  INVITATION_SENT,
  ARCHIVED,
}
