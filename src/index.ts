import { JobPostingRoutesBuilder } from './jobposting/v1/routes';
import express, { Request, Response, NextFunction } from 'express';

const cors = (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  next();
};

const app = express();
app.use(express.json());
app.use(cors);
app.use('/api', new JobPostingRoutesBuilder().build());

const PORT = 80;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});
