import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { JobPostingService } from './jobposting.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JobPosting, JobPostingOrNull } from '../domain';
import { Response } from 'express';
import { JobPostingPatch, JobPostingNew } from '../domain/job_posting';
import { User } from 'src/auth/v1/decorator/user.decorator';
import { UserDto } from 'src/auth/v1/domain';

@Controller('api')
export class JobPostingController {
  constructor(
    private readonly jobPostingService: JobPostingService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('v1/jobpostings')
  getJobPostings(): JobPosting[] {
    return this.jobPostingService.getJobPostings();
  }

  @Get('v1/jobpostings/:postId')
  getJobPosting(
    @Param('postId') postId: string,
    @Res() res: Response,
    @User() user: UserDto,
  ): void {
    this.logger.info(`Get Params: ${postId} for User: ${JSON.stringify(user)}`);
    const jobPosting: JobPostingOrNull = this.jobPostingService.getJobPosting(
      this.getId(postId),
    );
    if (jobPosting !== null) {
      const job: JobPosting = jobPosting;
      res.json(job).send();
    }
    res.status(HttpStatus.NOT_FOUND).end();
  }

  @Put('v1/jobpostings/:postId')
  putJobPostings(
    @Param('postId') postId: string,
    @Body() post: JobPostingNew,
  ): any {
    this.logger.info(`Put Params: ${postId}`);
    const status = this.jobPostingService.addOrReplaceJobPosting(
      this.getId(postId),
      post,
    );
    return { status: status };
  }

  @Patch('v1/jobpostings/:postId')
  patchJobPostings(
    @Param('postId') postId: string,
    @Body() post: JobPostingPatch,
  ): void {
    this.logger.info(`Post (update) Params: ${postId}`);
    try {
      this.jobPostingService.patchJobPosting(this.getId(postId), post);
    } catch (err) {
      throw new HttpException(
        'Update failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('v1/jobpostings/:postId')
  postUpdateJobPostings(
    @Param('postId') postId: string,
    @Body() post: JobPosting,
  ): void {
    this.logger.info(`Post (update) Params: ${postId}`);
    try {
      this.jobPostingService.updateJobPosting(this.getId(postId), post);
    } catch (err) {
      this.logger.error(err);
      throw new HttpException(
        'Update failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('v1/jobpostings')
  postCreateJobPostings(@Body() post: JobPostingNew): number {
    this.logger.info(`Post (new) Params: ${JSON.stringify(post)}`);
    return this.jobPostingService.addJobPosting(post);
  }

  @Delete('v1/jobpostings/:postId')
  deleteJobPostings(
    @Param('postId') postId: string,
    @Res() res: Response,
  ): void {
    this.logger.info(`Delete Params: ${postId}`);
    this.jobPostingService.deleteJobPosting(this.getId(postId));
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
