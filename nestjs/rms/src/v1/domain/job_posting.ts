import { Department } from './department';

export type JobPostingOrNull = JobPosting | null;

export interface JobPosting {
  id: number;
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
