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

export async function checkExistingUser(email: string): Promise<boolean> {
    const user = await User.findOne({
      attributes: ['email'],
      where: { email: email },
    });
    if (user) return true;
    else return false;
  }
  