import * as Event from "../controller/controllerEvent";

// Libreria per la gestione delle date
import * as moment from 'moment';
import { StatusCodes } from 'http-status-codes';

/**
 * Utils per la verifica dei parametri passati nelle richieste: stringhe, numeri, date, array, json
 * Si potrebbero inserire in un file separato ma per semplicità sono state inserite qui
 **/
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


// Middleware per la verfica che l'utente sia il proprietario dell'evento
// tramite l'id dell'evento e l'email dell'utente inviati poi come parametri al controller
export async function checkEventIsOwner(req: any, res: any, next: any) {
    // Ricerca se l'evento esiste tramite la funzione checkEventExistence ed eventualmente restituisce errore 404
    Event.checkEventExistence(req.body.event_id, res).then((checkEvent) => {
        if (checkEvent) {
            // Ricerca se l'utente è il proprietario dell'evento tramite la funzione checkEventIsOwner ed eventualmente restituisce errore 403
            Event.checkEventIsOwner(req.body.event_id, req.user.email, res).then((checkOwner) => {
                if (checkOwner) { next(); }
                else { res.status(StatusCodes.FORBIDDEN).json({ error: "You are not the owner of this event!" }); }
            });
        }
        else { res.status(StatusCodes.NOT_FOUND).json({ error: "Event not found" }); }
    });
}

// Middleware per le verifica che l'eveto esista tramite l'id dell'evento inviato come parametro al controller
export function checkEventExistence(req: any, res: any, next: any): void {
    Event.checkEventExistence(req.body.event_id, res).then((check) => {
        if (check) next();
        else res.status(StatusCodes.NOT_FOUND).json({ error: "Event not found" });
    })
}
// Middleware per le verifica che l'eveto esista tramite l'id dell'evento inviato come parametro al controller
export function checkEventBookings(req: any, res: any): void {
    Event.getEventBookings(req.body.event_id, res).then((check) => {
        if (check) res.status(StatusCodes.OK).json({ bookings: check });
        else res.status(StatusCodes.NOT_FOUND).json({ error: "Event not found" });
    })
}
// Middleqare per la verifica che l'evento sia aperto (status = 1)
export function checkEventStatus(req: any, res: any, next: any): void {
    Event.getEventStatus(req.body.event_id, res).then((result: number) => {
        if (result == 0) res.status(StatusCodes.FORBIDDEN).json({ error: "Event closed" });
        else next();
    })
}

// Middleware per la verifica del body della richiesta di informazioni sull'utente
export async function checkUserInfoBody(req: any, res: any, next: any) {
    const body = req.body;
    if (checkString(body.user)) {
        next();
    }
    else {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: "Malformed body" });
    }
}

// Verifica che il body della richiesta sia corretto ovvero che contenga il campo event_id
export async function checkEventIdBody(req: any, res: any, next: any) {
    const body = req.body;
    if (checkNumber(body.event_id)) {
        next();
    }
    else {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: "Malformed body" });
    }
}

// Middleware per la verifica del body della richiesta di creazione di un evento
export async function checkCreateEventBody(req: any, res: any, next: any) {
    const body = req.body;
    if (checkString(body.title) && checkArrayDate(body.datetimes) && checkNumber(body.mode) && checkNumber(body.latitude) && checkNumber(body.longitude) && checkString(body.link) && checkJSON(body.bookings) && checkBookingBody(body.bookings)) {
        next();
    }
    else {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: "Malformed body" });
    }
}

// Middleware per la verifica del body della richiesta di prenotazione di un evento
// Deveno essere presenti i campi event_id e datetimes, quest'ultimo deve essere un array di date
export async function checkBookEventBody(req: any, res: any, next: any) {
    const body = req.body;
    if (checkNumber(body.event_id) && checkArrayDate(body.datetimes)) {
        next();
    }
    else {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: "Malformed body" });
    }
}

// Middleware per la verifica del body della richiesta di aggiornamento numero di token di un utente
export async function checkUpdateTokenBody(req: any, res: any, next: any) {
    const body = req.body;
    if (checkString(body.update_user) && checkNumber(body.update_amount)) {
        next();
    }
    else {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: "Malformed body" });
    }
}

// Middleware per la verifica del body della richiesta di prenotazione di un evento
// Verifica che il body contenga il campo event_id e che il campo datetimes sia un array di date
function checkBookingBody(body: any) {
    if (body == null) return true;
    if (checkArray(body)) {
        for (let i = 0; i < body.length; i++) {
            if (!checkString(body[i].user) || !checkArrayDate(body[i].datetimes)) return false;
        }
        return true;
    }
    else return false;
}

// Middleware per la verifica delle prenotazioni richieste se sono già esistenti (doppione, ovvero se l'utente ha già prenotato una data)
export async function checkBookingExistence(req: any, res: any, next: any) {
    Event.getEventBookings(req.body.event_id, res).then((bookings: any) => {
        if (bookings == null) next();
        else {
            bookings = bookings.filter((booking: any) => booking.user === req.user.email);
            let check = false;
            for (let i = 0; i < req.body.datetimes.length; i++) {
                for (let j = 0; j < bookings.length; j++) {
                    if (req.body.datetimes[i] == bookings[j].datetimes) check = true;
                }
            }
            if (!check) next();
            else res.status(StatusCodes.CONFLICT).json({ error: "Booking already exists" });
        }
    })
}

// Middleware per la verifica che le date di prenotazione siano presenti nell'evento
export async function checkDatetimesExistence(req: any, res: any, next: any) {
    Event.getEventDatetimes(req.body.event_id, res).then((event_datetimes: any) => {
        let trovate = true;
        // Metodo un po' brutto...
        for (let i = 0; i < req.body.datetimes.length; i++) {
            let check = false;
            for (let j = 0; j < event_datetimes.length; j++) {
                // Utilizzo moment per verificare che le date siano uguali
                if (moment(req.body.datetimes[i]).isSame(event_datetimes[j])) { check = true; break; }
            }
            if (!check) { trovate = false; break; }
        }
        if (trovate) next();
        else res.status(StatusCodes.NOT_FOUND).json({ error: "Datetime not found" });
    })
}

/**
 * Middleware per la prenotazione di un evento in modalità 2
 * 
 * Verifica che le date di prenotazione non siano già state prenotate da altri utenti, in caso contrario restituisce un errore CONFLICT
 * 
**/
export async function checkBookingSecondMode(req: any, res: any, next: any) {
    if (req.body.mode == 2) {
        Event.getBookingsSlots(req.body.event_id, res).then((result: any) => {
            if (result == null) next();
            else {
                let check = false;
                for (let i = 0; i < result.length; i++) {
                    for (let j = 0; j < req.body.datetimes.length; j++) {
                        if (moment(result[i]).isSame(req.body.datetimes[j])) {
                            check = true;
                            return res.status(StatusCodes.CONFLICT).json({ error: "Slot already booked by others - mode event 2" });
                        }
                    }
                }
                if (check == false) {
                    next();
                }
            }
        })
    } else {
        next();
    }
}

/**
 * Middleware per la prenotazione di un evento in modalità 3
 * 
 * Verifica che l'utente non abbia già prenotato l'evento, in caso contrario restituisce un errore CONFLICT
 * 
**/
export async function checkBookingThirdMode(req: any, res: any, next: any) {
    if (req.body.mode === 3) {
        if (req.body.datetimes.length != 1) res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: "Malformed body - only one booking allowed" });
        else {
            Event.getEventBookings(req.body.event_id, res).then((result: any) => {
                if (result == null) next();
                else {
                    result = result.filter((elem: any) => elem.user === req.user.email);
                    if (result.length > 0) res.status(StatusCodes.CONFLICT).json({ error: "User already has booked - mode event 3" });
                    else next();
                }
            })
        }
    } else next();
}

// Middleware per recuperare la mode dell'evento non essendo presente nel body
export async function getEventMode(req: any, res: any, next: any) {
    Event.getEventMode(req.body.event_id, res).then((mode) => {
        req.body.mode = mode;
        next();
    });
}