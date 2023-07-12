import * as Event from "../controller/controllerEvent";

export async function checkEvent(req: any, res: any, next: any) {
    Event.checkEvent(req.user.event_id, req.user.email, res).then((check) => {
        if(check) next();
        else res.status(403).json({error:"You are not the owner of this event!"});
    })
}