import * as Event from "../controller/controllerEvent";
import * as moment from 'moment';

export async function checkEventIsOwner(req: any, res: any, next: any) {
    Event.checkEventIsOwner(req.body.event_id, req.user.email, res).then((check) => {
        if(check) next();
        else res.status(403).json({error:"You are not the owner of this event!"});
    })
}

export function checkEventExistence(req: any, res: any, next: any): void {
    Event.checkEventExistence(req.body.event_id, res).then((check) => {
        if(check) next();
        else res.status(404).json({error:"Event not found"});
    })
}

export function checkEventStatus(req: any, res: any, next: any): void {
    Event.getEventStatus(req.body.event_id, res).then((result: number) => {
        if(result == 0) res.status(403).json({error:"Event closed"});
        else next();
    })
}

// restituisce le prenotazioni di un evento
export async function middleEventBookings(event_id: number, res: any) {
    let bookings: Object[] | null;
    try{
        bookings = await Event.getEventBookings(event_id, res);
        
        if(bookings != null) {
            res.status(200).json({bookings:bookings});
        }
        else res.status(404).json({message:"Event with no booking (or event not found)"});
    }catch(error){
        res.status(500).json({error:error});
    }
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

export async function checkBookEventBody(req: any, res: any, next: any) {
    const body = req.body;
    if (checkNumber(body.event_id) && checkArrayDate(body.datetimes))
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
            if (!checkString(body[i].user) || !checkArrayDate(body[i].datetimes)) return false;
        }
        return true;
    }
    else return false;
}

export async function checkBookingExistence(req: any, res: any, next: any) {
    Event.getEventBookings(req.body.event_id, res).then((bookings: any) => {
        bookings = bookings.filter((booking: any) => booking.user === req.user.email);
        console.log(bookings);
        let check = false;
        for(let i = 0; i < req.body.datetimes.length; i++) {
            for(let j = 0; j < bookings.length; j++)
            {
                for (let k = 0; k < bookings[j].datetimes.length; k++)
            {
                if(moment(req.body.datetimes[i]).isSame(moment(bookings[j].datetimes[k]))) check = true;
             console.log("checking:" + moment(req.body.datetimes[i]) + " with " + moment(bookings[j].datetimes[k]))
            }
        }
        }
        console.log(check);
        if(!check) next();
        else res.status(400).json({error:"Booking already exists"});
    })
}

export async function checkDatetimesExistence(req: any, res: any, next: any) {
    Event.getEventDatetimes(req.body.event_id, res).then((event_datetimes: any) => {
        let check = false;
        for(let i = 0; i < req.body.datetimes.length; i++) {
            for(let j = 0; j < event_datetimes.length; j++)
            {
            if(moment(event_datetimes[j]).isSame(moment(req.body.datetimes[i]))) check = true;
            }
        }
    if (check) next();
    else res.status(404).json({error:"Datetime not found"});
    })
}


export async function checkBookingSecondMode(req: any, res: any, next: any) { 
    console.log("Mode is: ", req.body.mode);
    if (req.body.mode == 2) {
        console.log("Mode is 2. Getting all bookings for event: ", req.body.event_id);
        Event.getBookingsSlots(req.body.event_id, res).then((result: any) => {
            console.log("Bookings for event: ", req.body.event_id, " are: ", result);
            if (result == null) next();
            else {
            var filteredArray  = result.filter(function(result_el){
                return req.body.datetimes.filter(function(datetimes_el){
                   return moment(datetimes_el).isSame(moment(result_el));
                }).length != 0 
             });
             console.log("Filtered array: ", filteredArray);
             if(filteredArray.length != 0) {
                console.log("Some slots already booked.");
                return res.status(409).json({error:"Slot already booked"});
             } else {
                console.log("All slots are free");
                next();
             }
            }
        })
    } else {
        console.log("Mode is not 2. All slots are free");
        next(); 
    }             
}

export async function checkBookingThirdMode(req: any, res: any, next: any) {
    if(req.body.mode == 3) {
        if (req.body.datetimes.length != 1) res.status(400).json({error:"Malformed body - only one booking allowed"});
        else {
            Event.getEventBookings(req.body.event_id, res).then((result: any) => {
                result = result.filter((elem: any) => elem.user === req.user.email);
                if(result.length > 0) res.status(409).json({error:"User already has booked - mode event 3"});
                else next();
            })
        }
    } else next();
}


export async function getEventMode(req: any, res: any, next: any) {
    Event.getEventMode(req.body.event_id, res).then((mode) => {
        req.body.mode = mode;
        next();
    });
}