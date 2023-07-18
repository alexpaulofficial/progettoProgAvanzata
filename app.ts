// index.ts
import * as express from 'express';
import { Application, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import routes from './routes/routes';

const app: Application = express();

app.use(express.json());
app.use('/api', routes);

// Porta su cui l'applicazione è in ascolto
const PORT = 3000;
const HOST = '0.0.0.0';

// Viene impostata una rotta di default per l'accesso all'API
app.get('/', (req: Request, res: Response) => {
  res.send('Per accedere all\'API utilizzare il percorso /api');
});

// Middleware per la gestione degli errori di richiesta di rotte non esistenti
// Viene usato per restituire un JSON altrimenti verrebbe restituito un HTML
app.use(function (req, res) {
  res.status(StatusCodes.BAD_REQUEST).json({ error: "BAD REQUEST" });
})

// Muddleware per la gestione degli errori di richiesta con body non valido
// Viene usato per restituire un JSON altrimenti verrebbe restituito un HTML
app.use((err, req, res, next) => {
  if (err.status === StatusCodes.BAD_REQUEST && 'body' in err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).send({ error: err.message }); // Bad request
  }
  next();
});

app.listen(PORT, HOST);