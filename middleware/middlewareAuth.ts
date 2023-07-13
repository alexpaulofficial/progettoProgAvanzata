import * as jwt from 'jsonwebtoken';
import * as User from "../controller/controllerUser";

// si controlla se c'è l'header authorization
export function checkHeader(req, res, next){
    const authHeader = req.headers.authorization;
    if (authHeader) {
        next();
    }else{
        res.status(401).json({error:"no header"});
    }
};

export function checkToken(req,res,next){
  const bearerHeader = req.headers.authorization;
  if(typeof bearerHeader!=='undefined'){
      const bearerToken = bearerHeader.split(' ')[1];
      req.token=bearerToken;
      next();
  }else{
      res.status(403).json({error:"no token"});
  }
}

export function verifyAndAuthenticate(req, res, next) {
    try {
      let decoded = jwt.verify(req.token, process.env.SECRET_KEY);
      if (decoded !== null) {
        req.user = decoded;
        console.log("User: " + req.user.email + " verified");
        console.log("User role: " + req.user.role);
        next();
      } else {
        res.status(401).json({ error: "JWT incorrect" });
      }
    } catch (e) {
      res.status(401).json({ error: "JWT incorrect" });
    }
  }

  /*
  export async function checkUser(req, res, next) {
    if (req.user.email && req.user.role === "user") {
      next();
    } else {
      res.sendStatus(401).json({ error: "JWT incorrect" });
    }
  }
*/

// verifico che l'utente sia veramente un utente come specificato nel token
  export async function checkUserReq(req, res, next) {
    const user: any = await User.checkExistingUser(req.user.email);
    if (user) {
        next();
    } else {
      res.status(404).json({ error: "User not found" });
    }
  }

// verifico che l'utente sia veramente un admin come specificato nel token
export async function checkAdminReq(req, res, next) {
    const user: any = await User.checkExistingUser(req.user.email);
    console.log("User: " + user.email + " " + user.role);
        if (req.user.role === "admin" && user.role === "admin") {
            next();
        }
        else {
            res.status(403).json({ error: "User is not admin" });
        }
}


