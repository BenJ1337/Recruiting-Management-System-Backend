import { Request, Response, RequestHandler, NextFunction } from 'express';
import { JobPostingService } from '../service';
import { CommonController } from '../../../common/common_controller';
import { IJobPosting, IJobPostingOrNull } from '../domain/job_posting';
import { LOG } from '../../../crosscutting/logger'

export class JobPostingController extends CommonController {
  private static readonly jobContr: JobPostingController = new JobPostingController(JobPostingService.init());
  public static readonly paramJobPostingId: string = ':jobPostingId';
  public static init(): JobPostingController {
    return JobPostingController.jobContr;
  }

  private constructor(private readonly jobPostingService: JobPostingService) {
    super();
  }

  public getJobPostings(): RequestHandler {
    return async (req: Request, res: Response) => {
      LOG.info('Search for all JobPosting');
      const jobPostings: IJobPosting[] = await this.jobPostingService.getJobPostings();
      return res.status(200).json(jobPostings);
    };
  }

  public getJobPosting(): RequestHandler {
    return async (req: Request, res: Response) => {
      return await this.getId(req.params.jobPostingId).then(async jobId => {
        LOG.info(`Search JobPosting with Id: ${jobId}`);
        const jobPostings: IJobPostingOrNull = await this.jobPostingService.getJobPosting(jobId);
        return res.status(200).json(jobPostings);
      }).catch(err => {
        LOG.error(`Unable to search job posting because of ${err}`);
        return res.status(400).end();
      });
    };
  }

  public putJobPosting(): RequestHandler {
    return async (req: Request, res: Response) => {
      return await this.getId(req.params.jobPostingId).then(jobId => {
        LOG.info(`Create or Update JobPosting with Id: ${jobId}, Body: ${JSON.stringify(req.body)}`);
        const result = this.jobPostingService.addOrReplaceJobPosting(jobId, req.body);
        if (result) {
          return res.status(200).end();
        }
        return res.status(201).end();
      }).catch(err => {
        LOG.error(`Unable to create/ update job posting because of ${err}`);
        return res.status(400).end();
      });
    };
  }

  public postJobPosting(): RequestHandler {
    return async (req: Request, res: Response) => {
      LOG.info(`Create new job post, Body: ${JSON.stringify(req.body)}`);
      return await this.jobPostingService.addJobPosting(req.body)
        .then(id => res.status(200).json({ "id": id }),
          err => {
            LOG.error(`Error: ${err}`);
            return res.status(400).end();
          });
    };
  }

  public patchJobPosting(): RequestHandler {
    return async (req: Request, res: Response) => {
      return await this.getId(req.params.jobPostingId).then(jobId => {
        LOG.info(`Update JobPosting with Id: ${jobId}, Body: ${JSON.stringify(req.body)}`);
        this.jobPostingService.updateJobPosting(jobId, req.body);
        return res.status(200).end();
      }).catch(err => {
        LOG.error(`Unable to update job posting because of ${err}`);
        return res.status(400).end();
      });
    };
  }

  public deleteJobPosting(): RequestHandler {
    return async (req: Request, res: Response) => {
      return await this.getId(req.params.jobPostingId).then(jobId => {
        LOG.info(`Delete job posting with id: ${jobId}`);
        return this.jobPostingService.deleteJobPosting(jobId).then(succ => res.status(204).end(), err => {
          LOG.error(`Unable to delete job posting because of ${err}`);
          return res.status(400).end();
        })
      })
    }
  }

  private getId(id: string): Promise<any> {
    if (id !== null && id !== '' && !isNaN(Number(id))) {
      return Promise.resolve(parseInt(id));
    }
    return Promise.reject(new Error(`Expected an int for JobPostingId, but got: ${id}`));
  }
}