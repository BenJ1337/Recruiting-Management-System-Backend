import { Department } from '../domain';
import { IJobPosting, JobPostingStatus, IJobPostingOrNull } from '../domain/job_posting';
import { LOG } from '../../../crosscutting/logger';


export class JobPostingService {
  private static readonly jobService: JobPostingService = new JobPostingService();

  public static init(): JobPostingService {
    return JobPostingService.jobService;
  }

  private constructor(private readonly entrys: IJobPosting[] = []) {
    this.entrys.push({ id: 1, title: "Job 1", description: "Job Desc", department: Department.DEPARTMENT1, status: JobPostingStatus.DRAFT });
    this.entrys.push({ id: 2, title: "Job 2", description: "Job Desc", department: Department.DEPARTMENT2, status: JobPostingStatus.DRAFT });
  }

  public getJobPostings(): IJobPosting[] {
    LOG.info('getJobPostings');
    return this.entrys;
  }

  public getJobPosting(id: number): IJobPostingOrNull {
    return this.findJobPosting(id);
  }

  public addOrUpdateJobPosting(id: number, body: any): boolean {
    const deleted: boolean = this.removeJobPostingIfExists(id);
    const jobPosting = this.createJobPosting(id, body);
    this.entrys.push(jobPosting);
    LOG.info(`JobPosting ${deleted ? 'updated' : 'added'}: ${JSON.stringify(jobPosting)}`);
    return deleted;
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
    LOG.info(`JobPosting updated: ${JSON.stringify(jobPosting)}`);
  }

  public deleteJobPosting(id: number): boolean {
    return this.removeJobPostingIfExists(id);
  }

  private findJobPosting(id: number) {
    const entry: IJobPosting | undefined = this.entrys.filter(e => e.id == id).at(0);
    if (entry === undefined) {
      LOG.info(`No JobPosting for Id: ${id}`);
      return null;
    }
    LOG.info(`JobPosting found: ${JSON.stringify(entry)}`);
    return entry;
  }

  private removeJobPostingIfExists(id: number): boolean {
    const jobPosting = this.findJobPosting(id);
    if (jobPosting !== null) {
      this.entrys = this.entrys.filter(e => e !== jobPosting);
      LOG.info(`JobPosting with Id ${id} removed`)
      return true;
    }
    return false;
  }

  private createJobPosting(id: number, body: any): IJobPosting {
    const jobPosting: any = { "id": id };
    Object.assign(jobPosting, body);
    return jobPosting;
  }
}