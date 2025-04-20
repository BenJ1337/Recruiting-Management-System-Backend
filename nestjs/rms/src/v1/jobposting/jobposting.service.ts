import { Injectable, Inject } from '@nestjs/common';
import {
  JobPostingOrNull,
  JobPosting,
  JobPostingStatus,
  Department,
} from './../domain';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class JobPostingService {
  private entrys: JobPosting[] = [];
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.entrys.push({
      id: 1,
      title: 'Job 1',
      description: 'Job Desc',
      department: Department.DEPARTMENT1,
      status: JobPostingStatus.DRAFT,
    });
    this.entrys.push({
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
    return this.entrys;
  }

  public getJobPosting(id: number): JobPostingOrNull {
    return this.findJobPosting(id);
  }

  public addOrReplaceJobPosting(id: number, body: any): boolean {
    const deleted: boolean = this.removeJobPostingIfExists(id);
    const jobPosting = this.createJobPosting(id, body);
    this.entrys.push(jobPosting);
    this.logger.info(
      `JobPosting ${deleted ? 'updated' : 'added'}: ${JSON.stringify(jobPosting)}`,
    );
    return deleted;
  }

  public addJobPosting(body: any): number {
    const newId = this.getHighestId() + 1;
    const jobPosting = this.createJobPosting(newId, body);
    this.entrys.push(jobPosting);
    this.logger.info(`JobPosting with ${newId} added.`);
    return newId;
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
    const entry: JobPosting | undefined = this.entrys
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
      this.entrys = this.entrys.filter((e) => {
        const value: JobPosting = jobPosting;
        return e !== value;
      });
      this.logger.info(`JobPosting with Id ${id} removed`);
      return true;
    }
    return false;
  }

  private createJobPosting(id: number, body: any): JobPosting {
    const jobPosting: Partial<JobPosting> = { id: id };
    Object.assign(jobPosting, body);
    return jobPosting as JobPosting;
  }

  private getHighestId(): number {
    return this.entrys
      .map((jobPosting) => jobPosting.id)
      .reduce((a, b) => Math.max(a, b));
  }
}
