import { Department } from './Department';

export type IJobPostingOrNull = IJobPosting | null;

export interface IJobPosting {
  id: number,
  title: string,
  description: string,
  department: Department,
  status: JobPostingStatus,
  note?: string;
}

export enum JobPostingStatus {
  DRAFT,
  QA,
  PUBLISHED,
  SCREENING_OF_APPLICATIONS,
  INVITATION_SENT,
  ARCHIVED
}