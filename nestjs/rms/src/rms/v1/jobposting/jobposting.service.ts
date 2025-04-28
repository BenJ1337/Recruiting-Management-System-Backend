import { Injectable, Inject } from '@nestjs/common';
import {
  JobPostingOrNull,
  JobPosting,
  JobPostingStatus,
  Department,
} from '../domain';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JobPostingNew, JobPostingPatch } from '../domain/job_posting';

@Injectable()
export class JobPostingService {
  private jobPostingMap: Map<number, JobPosting> = new Map();
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.jobPostingMap.set(1, {
      id: 1,
      title: 'Job 1',
      description: 'Job Desc',
      department: Department.DEPARTMENT1,
      status: JobPostingStatus.DRAFT,
    });
    this.jobPostingMap.set(2, {
      id: 2,
      title: 'Job 2',
      description: 'Job Desc',
      department: Department.DEPARTMENT2,
      status: JobPostingStatus.DRAFT,
    });
  }

  public getJobPostings(): JobPosting[] {
    return Array.from(this.jobPostingMap.values());
  }

  public getJobPosting(id: number): JobPostingOrNull {
    const jobPosting = this.jobPostingMap.get(id);
    if (jobPosting == undefined) {
      return null;
    }
    return jobPosting;
  }

  public addOrReplaceJobPosting(
    id: number,
    jobPostingNew: JobPostingNew,
  ): string {
    const created: string = this.jobPostingMap.has(id) ? 'updated' : 'created';
    const jobPosting: JobPosting = this.createJobPosting(jobPostingNew);
    jobPosting.id = id;
    this.jobPostingMap.set(id, jobPosting);
    this.logger.info(`Job posting ${created}: ${JSON.stringify(jobPosting)}`);
    return created;
  }

  public addJobPosting(jobPostingNew: JobPostingNew): number {
    const jobPosting: JobPosting = this.createJobPosting(jobPostingNew);
    this.jobPostingMap.set(jobPosting.id, jobPosting);
    return jobPosting.id;
  }

  public updateJobPosting(id: number, jobPostingNew: JobPosting): void {
    const jobPosting = this.jobPostingMap.get(id);
    if (jobPosting == undefined) {
      throw new Error(`There is no job posting for id: ${id}`);
    }
    this.jobPostingMap.set(id, jobPostingNew);
    this.logger.info(`JobPosting updated: ${JSON.stringify(jobPosting)}`);
  }

  public patchJobPosting(id: number, jobPostingUpdate: JobPostingPatch): void {
    const jobPosting = this.jobPostingMap.get(id);
    if (jobPosting == undefined) {
      throw new Error(`There is no job posting for id: ${id}`);
    }
    for (const key in jobPostingUpdate) {
      const val = jobPostingUpdate[key];
      if (!jobPosting.hasOwnProperty(key)) {
        throw new Error(`Job posting doesn't have the property: ${key}`);
      }
      jobPosting[key] = val;
    }
    this.logger.info(`JobPosting updated: ${JSON.stringify(jobPosting)}`);
  }

  public deleteJobPosting(id: number): boolean {
    return this.removeJobPostingIfExists(id);
  }

  private findJobPosting(id: number): JobPostingOrNull {
    const entry: JobPosting | undefined = this.jobPostingMap.get(id);
    if (entry === undefined) {
      this.logger.info(`No JobPosting for Id: ${id}`);
      return null;
    }
    this.logger.info(`JobPosting found: ${JSON.stringify(entry)}`);
    return entry;
  }

  private removeJobPostingIfExists(id: number): boolean {
    const deleted = this.jobPostingMap.delete(id);
    this.logger.info(`JobPosting with Id ${id} removed`);
    return deleted;
  }

  private createJobPosting(jobPosting: JobPostingNew): JobPosting {
    const newId = this.getHighestId() + 1;
    const jobPostingComplete: Partial<JobPosting> = { id: newId };
    Object.assign(jobPostingComplete, jobPosting);
    this.logger.info(`JobPosting with ${newId} created.`);
    return jobPostingComplete as JobPosting;
  }

  private getHighestId(): number {
    const entries = Array.from(this.jobPostingMap.values());
    if (entries.length == 0) {
      return 1;
    }
    if (entries.length == 1) {
      return entries[0].id;
    }
    const highestId = entries
      .map((jobPosting) => jobPosting.id)
      .reduce((a, b) => Math.max(a, b));
    this.logger.info(`Highest Id of all job postings: ${highestId}`);
    return highestId;
  }
}
