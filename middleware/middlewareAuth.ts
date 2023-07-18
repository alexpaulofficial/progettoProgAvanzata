import { StatusCodes } from 'http-status-codes';
import * as jwt from 'jsonwebtoken';
import * as User from "../controller/controllerUser";

// Costanti per i ruoli
const ADMIN: string = "admin";

// Controlla se l'header authorization è presente, altrimenti restituisce errore 412
export function checkHeader(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    next();
  } else {
    res.status(StatusCodes.PRECONDITION_FAILED).json({ error: "Authorization header missing" });
  }
};

// Verifica che il token sia presente e lo estrae
export function checkToken(req, res, next) {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    req.token = bearerToken;
    next();
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: "Token not provided" });
  }
}

// Verifica che il token sia valido e lo decodifica per estrarre l'email e il ruolo
export function verifyAndAuthenticate(req, res, next) {
  try {
    let decoded = jwt.verify(req.token, process.env.SECRET_KEY);
    if (decoded !== null) {
      req.user = decoded;
      // Verifica che siano presenti email e ruolo e che siano stringhe
      if (req.user.email && req.user.role && typeof req.user.email == "string" && typeof req.user.role == "string") {
        next();
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ error: "JWT incorrect" });
      }
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json({ error: "JWT incorrect" });
    }
  } catch (e) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: "JWT incorrect" });
  }
}

// Verifica che l'utente sia effettivamente registrato nel database
export async function checkUserReq(req, res, next) {
  const user: any = await User.checkExistingUser(req.user.email);
  if (user) {
    next();
  } else {
    res.status(StatusCodes.NOT_FOUND).json({ error: "User not registered" });
  }
}


// Verifica che l'utente sia veramente un admin come specificato nel token
export async function checkAdminReq(req, res, next) {
  const user: any = await User.checkExistingUser(req.user.email);
  if (req.user.role === ADMIN && user.role === ADMIN) {
    next();
  }
  else {
    res.status(StatusCodes.FORBIDDEN).json({ error: "User is not admin" });
  }
}