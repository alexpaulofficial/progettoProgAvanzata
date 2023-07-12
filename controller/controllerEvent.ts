import { Event } from '../model/Event';
import '../controller/controllerUser'
import { checkBalanceCost, decreaseToken } from '../controller/controllerUser';

let eventTypeCost: Map<number, number> = new Map();
eventTypeCost.set(1,1); 
eventTypeCost.set(2,2); 
eventTypeCost.set(3,4); 

// creazione evento con riduzione token utente (se disponibili)
export function createEvent(event: any, res: any): void{
    checkBalanceCost(event.owner, eventTypeCost.get(event.mode), res).then(balance => {if (balance == true) {
        decreaseToken(event.owner, eventTypeCost.get(event.mode), res);
        Event.create(event).then((item) => {
            res.status(201).json({message:"Event CREATED succesfully"});
        }).catch((error) => {
            res.status(500).json({error:error});
        });}
        else {
            res.status(401).json({error:"Balance too low"});
        } 
    }).catch((error) => {
        res.status(500).json({error:error});
    });
}

// visulaizzazione eventi attivi e non di un utente (owner)
export function showEventsOwner(email: string, res: any): void{
    Event.findAll({where: { owner : email }, raw: true}).then((items: object[]) => {
        const open: object[] = items.filter((element: any) => element.status == 1);
        const closed: object[] = items.filter((element: any) => element.status == 0);
        res.status(200).json({open_events:open,closed_events:closed});
    }).catch((error) => {
        res.status(500).json({error:error});
    });
}

// restituisce le prenotazioni di un evento
export function getEventBookings(event_id: number, res: any): void {
    let event: any;
    try{
        event = Event.findAll({where: { id: event_id}, raw: true}).then((booking: any) => {
            console.log(booking)
            if(booking != "") res.status(200).json({bookings:event.bookings});
                else res.status(404).json({message:"Event with no booking (or event not found)"});
        });
    }catch(error){
        res.status(500).json({error:error});
    }
}

export async function closeEvent(event_id: number, res: any) {
    Event.update({status: 0}, {where: {id: event_id}}).then(() => {
        res.status(200).json({message:"Event CLOSED succesfully"});
    }).catch((error) => {
        res.status(500).json({error:error});
    });
}

export async function checkEvent(id: number, owner: string, res: any): Promise<boolean> {
    let result: any;
    try{
        result= await Event.findByPk(id, {raw: true});
    }catch(error){
        res.status(500).json({error:error});
        return false;
    }
    if (result != null) {
        console.log(result.owner)
        return result.owner == owner;
    }
    else {  
        res.status(404).json({error:"Event not found"});
        return false;
    }
}