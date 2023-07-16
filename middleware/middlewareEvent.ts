import * as Event from "../controller/controllerEvent";
import * as moment from 'moment';

export async function checkEvent(req: any, res: any, next: any) {
    Event.checkEvent(req.body.event_id, req.user.email, res).then((check) => {
        if(check) next();
        else res.status(403).json({error:"You are not the owner of this event!"});
    })
}

export async function checkEventsOwnerBody(req: any, res: any, next: any) {
    const body = req.body;
    if (checkString(body.owner)){
        next();
    }
    else {
        res.status(400).json({error:"Malformed body"});
    }
}

export async function checkUserInfoBody(req: any, res: any, next: any) {
    const body = req.body;
    if (checkString(body.user)){
        next();
    }
    else {
        res.status(400).json({error:"Malformed body"});
    }
}
  
export async function checkEventIdBody(req: any, res: any, next: any) {
    const body = req.body;
    if (checkNumber(body.event_id)){
        next();
    }
    else {
        res.status(400).json({error:"Malformed body"});
    }
}

export async function checkCreateEventBody(req: any, res: any, next: any) {
    const body = req.body;
    if (checkString(body.title) && checkArrayDate(body.datetimes) && checkNumber(body.mode) && checkNumber(body.latitude) && checkNumber(body.longitude) && checkString(body.link) && checkJSON(body.bookings) && checkBookingBody(body.bookings))
    {
        next();
    }
    else {
        res.status(400).json({error:"Malformed body"});
    }
}

export async function checkIncrementTokenBody(req: any, res: any, next: any) {
    const body = req.body;
    if (checkString(body.increment_user) && checkNumber(body.increment_amount)) {
        next();
    }
    else {
        res.status(400).json({error:"Malformed body"});
    }
}

function checkString(string: any) {
    return string != null && typeof string === 'string';
}

function checkNumber(number: any) {
    return number != null && typeof number === 'number';
}

function checkDate(date: any) {
    return moment(date).isValid();
}

function checkArray(array: any) {
    return array != null && Array.isArray(array);
}
function checkArrayDate(array: any) {
    if (checkArray(array)) {
        for (let i = 0; i < array.length; i++) {
            if (!checkDate(array[i])) return false;
        }
        return true;
    }
    else return false;
}

function checkJSON(json: any) {
    return typeof json === 'object';
}

function checkBookingBody(body: any) {
    if(body == null) return true;
    if (checkArray(body)) {
        for (let i = 0; i < body.length; i++) {
            if (!checkString(body[i].email) || !checkArrayDate(body[i].datetimes)) return false;
        }
        return true;
    }
    else return false;
}