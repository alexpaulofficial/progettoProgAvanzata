import { User} from '../model/User';

// controlla il numero di token disponibili per un utente. Se sono disponibili a sufficienza restituisce true, altrimenti restituisce false
export async function checkBalanceCost(email: string, cost: number, res: any): Promise<boolean>{
    let result: any;
    try{
        result = await User.findByPk(email, {raw: true});
    }catch(error){
        res.status(500).json({error:error})
    }
    if(result.token >= cost) {
        return true;
    }
    else return false;
}

// diminuisce il numero di token dato il costo dell'evento
export async function incrementToken(user: string, amount : number, res: any): Promise<void> {
    let result: any;
    try{
        result = await User.findByPk(user, {raw: true});
        if(result !== null){
            await incrementTokenInDB(user, amount).then(() => {
            res.status(200).json({message:"Token increased successfully"});
            }).catch((error) => {
                res.status(500).json({error:error});
            });
        }else{
            res.status(500).json({error:"User to increment not found"})
        }
    }catch(error){
        res.status(500).json({error:error})
    }
}

export async function incrementTokenInDB(user: string, amount : number): Promise<void> {
    try{
        await User.increment(['token'], {by: amount, where: { email: user} });
    }catch(error){
        throw error;
    }
}

// diminuisce il numero di token dato il costo dell'evento
export async function decreaseToken(email: string, cost: number, res: any): Promise<boolean>{
    let result: any;
    try{
        result = await User.findByPk(email, {raw: true});
        User.decrement(['token'], {by: cost, where: { email: email} });
        return true;
    }catch(error){
        res.status(500).json({error:error})
        return false;
    }
}

// restituisce le info dell'utente (serve per testare il token)
export function userInfo(email: string, res: any): void {
    User.findAll({where: { email : email }, raw: true}).then((item: object) => {
        res.status(200).json({user:item});
    }).catch((error) => {
        res.status(500).json({error:error});
    });
}

export async function checkExistingUser(email: string): Promise<any> {
    const user = await User.findOne({
      where: { email: email },
    });
    if (user) return user;
    else return false;
  }
  