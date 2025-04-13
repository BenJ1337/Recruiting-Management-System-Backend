import { Request, Response, NextFunction, RequestHandler } from 'express';
import zod, { ZodError } from 'zod';
import { LOG } from '../../../crosscutting'

export class JobPostingValidator {
    private static schema = zod.object({
        title: zod.string(),
        description: zod.string(),
        department: zod.string(),
        status: zod.string(),
        note: zod.string().optional()
    });

    public static validateJobPosting(): RequestHandler {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                this.schema.parse(req.body);
                next();
            } catch (exc) {
                LOG.info(`Data for job posting incorrect : ${exc}`);
                if (exc instanceof ZodError) {
                    return res.status(400).json({ errors: exc.errors });
                }
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }
}