import { CommonRoutesBuilder } from '../../../common/common_routes';
import { Router } from 'express';
import { JobPostingController, JobPostingValidator } from '../controller';

export class JobPostingRoutesBuilder extends CommonRoutesBuilder {

    constructor() {
        super('/v1/jobpostings');
    }

    public override build(): Router {
        const router: Router = Router();
        const contr: JobPostingController = JobPostingController.init();
        const pathWithParam = `${this.path}/${JobPostingController.paramJobPostingId}`;
        router.get(this.path, contr.getJobPostings());
        router.get(pathWithParam, contr.getJobPosting());
        router.put(pathWithParam, JobPostingValidator.validateJobPosting(), contr.putJobPosting());
        router.patch(pathWithParam, contr.patchJobPosting());
        router.delete(pathWithParam, contr.deleteJobPosting());
        return router;
    }
}