// index.ts
import * as express from 'express';
import { Application, Request, Response } from 'express';

import routes from './routes/routes';

const app: Application = express();

app.use(express.json());
app.use('/api', routes);

const PORT = 3000;
const HOST = '0.0.0.0';

app.get('/', (req: Request, res: Response) => {
  res.send('Per accedere all\'API utilizzare il percorso /api');
});

app.use(function (req, res) {
  res.status(401).json({ error: "BAD REQUEST" });
})

app.listen(PORT, HOST);