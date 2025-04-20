import { Test, TestingModule } from '@nestjs/testing';
import { JobPostingController } from './jobposting.controller';
import { JobPostingService } from './jobposting.service';

describe('AppController', () => {
  let jobPostingController: JobPostingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [JobPostingController],
      providers: [JobPostingService],
    }).compile();

    jobPostingController = app.get<JobPostingController>(JobPostingController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(jobPostingController.getJobPostings()).toBe('Hello World!');
    });
  });
});
