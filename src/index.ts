import { JobPostingRoutesBuilder } from './jobposting/v1/routes';
import express from 'express';

const app = express();

app.use(express.json());
app.use('/api', new JobPostingRoutesBuilder().build())

const PORT = 80;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});
