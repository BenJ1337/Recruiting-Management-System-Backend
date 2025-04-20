import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { JobPostingService } from './jobposting.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JobPosting, JobPostingOrNull } from '../domain';
import { Response } from 'express';

@Controller('api')
export class JobPostingController {
  constructor(
    private readonly jobPostingService: JobPostingService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) { }

  @Get('v1/jobpostings')
  getJobPostings(): JobPosting[] {
    return this.jobPostingService.getJobPostings();
  }

  @Get('v1/jobpostings/:id')
  getJobPosting(@Param('id') id: string, @Res() res: Response): void {
    const jobPosting: JobPostingOrNull = this.jobPostingService.getJobPosting(
      this.getId(id),
    );
    if (jobPosting !== null) {
      const job: JobPosting = jobPosting;
      res.json(job).send();
    }
    res.status(HttpStatus.NOT_FOUND).end();
  }

  @Put('v1/jobpostings/:id')
  putJobPostings(
    @Param('id') id: string,
    @Param('post') post: JobPosting,
  ): boolean {
    this.logger.info(`Params: ${JSON.stringify(id)}`);
    return this.jobPostingService.addOrReplaceJobPosting(this.getId(id), post);
  }

  @Post('v1/jobpostings/:id')
  postJobPostings(@Param('id') post: JobPosting): number {
    this.logger.info(`Params: ${JSON.stringify(post)}`);
    return this.jobPostingService.addJobPosting(post);
  }

  @Delete('v1/jobpostings/:id')
  deleteJobPostings(@Param('id') id: string, @Res() res: Response) {
    this.logger.info(`Params: ${JSON.stringify(id)}`);
    this.jobPostingService.deleteJobPosting(this.getId(id));
    res.status(HttpStatus.NO_CONTENT).send();
  }

  private getId(id: string): number {
    if (id !== null && id !== '' && !isNaN(Number(id))) {
      return parseInt(id);
    }
    throw new HttpException(
      `Expected an int for JobPostingId, but got: ${id}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
