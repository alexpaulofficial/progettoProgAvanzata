import { User } from '../model/User';
import { StatusCodes } from 'http-status-codes';

// Controlla il numero di token disponibili per un utente. 
// Se sono disponibili a sufficienza per creare l'evento restituisce true, altrimenti restituisce false
// Se ci sono problemi con il DB restituisce un errore NOT FOUND
export async function checkBalanceCost(email: string, cost: number, res: any): Promise<boolean> {
    let result: any;
    try {
        result = await User.findByPk(email, { raw: true });
    } catch (error) {
        res.status(StatusCodes.UNAUTHORIZED).json({ error: error })
    }
    if (result.token >= cost) {
        return true;
    }
    else return false;
}

// Sostituisce il numero di token di un utente con un nuovo valore
// Se l'utente non esiste restituisce un errore NOT FOUND (è stato controlalto prima che l'utente esistesse, non dovrebbe mai capitare)
export async function updateToken(user: string, amount: number, res: any): Promise<void> {
    let result: any;
    try {
        result = await User.findByPk(user, { raw: true });
        if (result !== null) {
            await updateTokenInDB(user, amount).then(() => {
                res.status(StatusCodes.OK).json({ message: "Token increased successfully" });
            }).catch((error) => {
                res.status(StatusCodes.NOT_FOUND).json({ error: error });
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ error: "User to update not found" })
        }
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({ error: error })
    }
}

// Funzione che aggiorna il numero di token di un utente nel DB
// E' una funzione di supporto per updateToken
export async function updateTokenInDB(user: string, amount: number): Promise<void> {
    try {
        await User.update({ token: amount }, { where: { email: user } });
    } catch (error) {
        throw error;
    }
}

// Diminuisce il numero di token dato il costo dell'evento
// Se l'utente non esiste restituisce un errore NOT FOUND
export async function decreaseToken(email: string, cost: number, res: any): Promise<boolean> {
    let result: any;
    try {
        result = await User.findByPk(email, { raw: true });
        User.decrement(['token'], { by: cost, where: { email: email } });
        return true;
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({ error: error })
        return false;
    }
}

// Restituisce le info dell'utente (serve per testare il token, funzione non richiesta dal progetto ma utile per testare alcune funzionalità)
export function userInfo(email: string, res: any): void {
    User.findAll({ where: { email: email }, raw: true }).then((item: object) => {
        res.status(StatusCodes.OK).json({ user: item });
    }).catch((error) => {
        res.status(StatusCodes.NOT_FOUND).json({ error: error });
    });
}

// Verfica che l'utente esista nel DB
// Viene usata per verificare che l'utente esista nella fase di autenticazione
export async function checkExistingUser(email: string): Promise<any> {
    const user = await User.findOne({
        where: { email: email },
    });
    if (user) return user;
    else return false;
}
