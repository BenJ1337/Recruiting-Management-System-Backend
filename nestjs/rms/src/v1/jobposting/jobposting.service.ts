import { Injectable, Inject } from '@nestjs/common';
import {
  JobPostingOrNull,
  JobPosting,
  JobPostingStatus,
  Department,
} from './../domain';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JobPostingNew } from '../domain/job_posting';

@Injectable()
export class JobPostingService {
  private entries: JobPosting[] = [];
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.entries.push({
      id: 1,
      title: 'Job 1',
      description: 'Job Desc',
      department: Department.DEPARTMENT1,
      status: JobPostingStatus.DRAFT,
    });
    this.entries.push({
      id: 2,
      title: 'Job 2',
      description: 'Job Desc',
      department: Department.DEPARTMENT2,
      status: JobPostingStatus.DRAFT,
    });
  }

  public getJobPostings(): JobPosting[] {
    const highestId = this.getHighestId();
    this.logger.info(`get all job postings: ${highestId}`);
    return this.entries;
  }

  public getJobPosting(id: number): JobPostingOrNull {
    return this.findJobPosting(id);
  }

  public addOrReplaceJobPosting(
    id: number,
    jobPostingNew: JobPostingNew,
  ): boolean {
    const deleted: boolean = this.removeJobPostingIfExists(id);
    const jobPosting = this.createJobPosting(jobPostingNew);
    this.entries.push(jobPosting);
    this.logger.info(
      `JobPosting ${deleted ? 'updated' : 'added'}: ${JSON.stringify(jobPosting)}`,
    );
    return deleted;
  }

  public addJobPosting(jobPostingNew: JobPostingNew): number {
    const jobPosting: JobPosting = this.createJobPosting(jobPostingNew);
    this.entries.push(jobPosting);
    return jobPosting.id;
  }

  public updateJobPosting(id: number, jobPostingUpdate: any): void {
    const jobPosting = this.findJobPosting(id);
    if (jobPosting == null) {
      throw new Error(`There is not job posting for id: ${id}`);
    }
    for (const key in jobPostingUpdate) {
      if (jobPostingUpdate.hasOwnProperty(key)) {
        const val = jobPostingUpdate[key];
        if (!jobPosting.hasOwnProperty(key)) {
          throw new Error(`Job posting doesn't have the property: ${key}`);
        }
        jobPosting[key] = val;
      }
    }
    this.logger.info(`JobPosting updated: ${JSON.stringify(jobPosting)}`);
  }

  public deleteJobPosting(id: number): boolean {
    return this.removeJobPostingIfExists(id);
  }

  private findJobPosting(id: number): JobPostingOrNull {
    const entry: JobPosting | undefined = this.entries
      .filter((e) => e.id == id)
      .at(0);
    if (entry === undefined) {
      this.logger.info(`No JobPosting for Id: ${id}`);
      return null;
    }
    this.logger.info(`JobPosting found: ${JSON.stringify(entry)}`);
    return entry;
  }

  private removeJobPostingIfExists(id: number): boolean {
    const jobPosting = this.findJobPosting(id);
    if (jobPosting !== null) {
      this.entries = this.entries.filter((e) => {
        const value: JobPosting = jobPosting;
        return e !== value;
      });
      this.logger.info(`JobPosting with Id ${id} removed`);
      return true;
    }
    return false;
  }

  private createJobPosting(jobPosting: JobPostingNew): JobPosting {
    const newId = this.getHighestId() + 1;
    const jobPostingComplete: Partial<JobPosting> = { id: newId };
    Object.assign(jobPostingComplete, jobPosting);
    this.logger.info(`JobPosting with ${newId} created.`);
    return jobPostingComplete as JobPosting;
  }

  private getHighestId(): number {
    if (this.entries.length == 0) {
      return 1;
    }
    if (this.entries.length == 1) {
      return this.entries[0].id;
    }
    return this.entries
      .map((jobPosting) => jobPosting.id)
      .reduce((a, b) => Math.max(a, b));
  }
}
