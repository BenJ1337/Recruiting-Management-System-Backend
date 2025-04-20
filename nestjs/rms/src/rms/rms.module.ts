import { Module } from '@nestjs/common';
import { JobPostingController, JobPostingService } from './v1';

@Module({
  controllers: [JobPostingController],
  providers: [JobPostingService],
})
export class RecruitingManagementSystemModule { }
