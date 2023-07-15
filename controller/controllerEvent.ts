import { Event } from '../model/Event';
import '../controller/controllerUser'
import { checkBalanceCost, decreaseToken } from '../controller/controllerUser';

let eventTypeCost: Map<number, number> = new Map();
eventTypeCost.set(1,1); 
eventTypeCost.set(2,2); 
eventTypeCost.set(3,4); 

// creazione evento con riduzione token utente (se disponibili)
export async function createEvent(req: any, res: any) {
    checkBalanceCost(req.user.email, eventTypeCost.get(req.body.mode), res).then(balance => {if (balance == true) {
        req.body.owner = req.user.email;
        Event.create(req.body).then((item) => {
            decreaseToken(req.user.email, eventTypeCost.get(req.body.mode), res);
            res.status(201).json({message:"Event CREATED successfully"});
        }).catch((error) => {
            res.status(404).json({"Not found": error});
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
export async function getEventBookings(event_id: number, res: any) {
    let event: any;
    try{
        event = Event.findByPk(event_id, {raw: true}).then((booking: any) => {
            if(booking != null) {
                res.status(200).json({bookings:booking.bookings});
            }
            else res.status(404).json({message:"Event with no booking (or event not found)"});
        });
    }catch(error){
        res.status(500).json({error:error});
    }
}

export async function closeEvent(event_id: number, res: any) {
    Event.update({status: 0}, {where: {id: event_id}}).then(() => {
        res.status(200).json({message:"Event CLOSED successfully"});
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

export async function deleteEvent(event_id: number, res: any) {
    Event.findByPk(event_id, {raw: true}).then((event: any) => {
        if(event != null) {
            if(event.bookings == null) {
                Event.destroy({where: {id: event_id}}).then(() => {
                    res.status(200).json({message:"Event DELETED successfully"});
                }).catch((error) => {
                    res.status(500).json({error:error});
                });
            }
            else {
                res.status(403).json({error:"Event with bookings"});
            }
        }
            else {
                res.status(404).json({error:"Event not found"});
            }
    }).catch((error) => {   
        res.status(500).json({error:error});
    });
}