import { Event } from '../model/Event';
import '../controller/controllerUser'
import { checkBalanceCost, decreaseToken } from '../controller/controllerUser';
import { StatusCodes } from 'http-status-codes';

// Mappa che associa ad ogni tipo di evento il numero di token da decrementare
let eventTypeCost: Map<number, number> = new Map();
eventTypeCost.set(1, 1);
eventTypeCost.set(2, 2);
eventTypeCost.set(3, 4);

/**
 * Creazione evento e salvataggio nel database.
 * 
 * Se l'utente non ha abbastanza token restituisce un errore 401, altrimenti restituisce un messaggio di successo 201, decrementando poi il numero di token dell'utente.
 * Il numero di token da decrementare è calcolato in base al tipo di evento e viene recuperato dalla mappa {@link eventTypeCost}.
 * Se ci sono problemi con il DB restituisce un errore 404.
 * 
 * @param req La richiesta HTTP da cui recuperare i dati dell'evento da creare
 * @param res La risposta HTTP da inviare
 * 
 **/
export async function createEvent(req: any, res: any) {
    checkBalanceCost(req.user.email, eventTypeCost.get(req.body.mode), res).then(balance => {
        if (balance == true) {
            req.body.owner = req.user.email;
            Event.create(req.body).then(() => {
                decreaseToken(req.user.email, eventTypeCost.get(req.body.mode), res);
                res.status(StatusCodes.CREATED).json({ message: "Event CREATED successfully" });
            }).catch((error) => {
                res.status(StatusCodes.NOT_FOUND).json({ error: error });
            });
        }
        else {
            res.status(StatusCodes.UNAUTHORIZED).json({ error: "Balance too low" });
        }
    }).catch((error) => {
        res.status(StatusCodes.NOT_FOUND).json({ error: error });
    });
}

/**
 * Visualizzazione tutti gli eventi di cui l'utente è proprietario.
 * 
 * Restituisce un array di oggetti JSON contenente gli eventi aperti e chiusi (vuoti se non ce ne sono)
 * Se ci sono problemi con il DB restituisce un errore 404.
 * 
 * @param email L'email dell'utente di cui visualizzare gli eventi
 * @param res La risposta HTTP da inviare
 * 
 **/
export function showEventsOwner(email: string, res: any): void {
    Event.findAll({ where: { owner: email }, raw: true }).then((items: object[]) => {
        const open: object[] = items.filter((element: any) => element.status == 1);
        const closed: object[] = items.filter((element: any) => element.status == 0);
        res.status(StatusCodes.OK).json({ open_events: open, closed_events: closed });
    }).catch((error) => {
        res.status(StatusCodes.NOT_FOUND).json({ error: error });
    });
}


/**
 * Ricerca prenotazioni attive di un evento.
 * 
 * Restituisce l'array di oggetti JSON contenente le prenotazioni dell'evento oppure errore
 * 
 * @param event_id L'id dell'evento di cui visualizzare le prenotazioni
 * @param res La risposta HTTP da inviare (contiene l'array di prenotazioni o un errore)
 * 
 **/
export async function getEventBookings(event_id: number, res: any) {
    let event: any;
    try {
        event = await Event.findByPk(event_id, { raw: true });
        if (event != null) {
            if (event.bookings == null) return [];
            else return event.bookings;
        }
        else false;
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({ error: error });
    }
}

/**
 * Chiusura prenotazioni di un evento.
 * 
 * @param event_id L'id dell'evento di cui chiudere le prenotazioni
 * @param res La risposta HTTP da inviare con il messaggio di successo o errore
 * 
 **/
export async function closeEvent(event_id: number, res: any) {
    Event.update({ status: 0 }, { where: { id: event_id } }).then(() => {
        res.status(StatusCodes.OK).json({ message: "Event CLOSED successfully" });
    }).catch((error) => {
        res.status(StatusCodes.NOT_FOUND).json({ error: error });
    });
}

/**
 * Verifica che l'utente sia il proprietario dell'evento.
 * 
 * Ciò serve per evitare che un utente possa chiudere le prenotazioni di un evento o cancellarlo se non ne è proprietario.
 * 
 * @param id L'id dell'evento da controllare
 * @param owner L'email dell'utente da controllare
 * @param res La risposta HTTP da inviare con il messaggio di successo o errore
 * @returns true se l'utente è il proprietario dell'evento, false altrimenti
 * 
 **/
export async function checkEventIsOwner(id: number, owner: string, res: any): Promise<boolean> {
    let result: any;
    try {
        result = await Event.findByPk(id, { raw: true });
    } catch (error) {
        return false;
    }
    if (result != null) {
        return result.owner == owner;
    }
    else {
        return false;
    }
}

/**
 * Verifica esisteza di un evento.
 * 
 * @param event_id L'id dell'evento da controllare
 * @param res La risposta HTTP da inviare con il messaggio di successo o errore
 * @returns true se l'evento esiste, false altrimenti
 * 
 **/
export async function checkEventExistence(event_id: number, res: any): Promise<boolean> {
    let result: any;
    try {
        result = await Event.findByPk(event_id, { raw: true });
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({ error: error });
    }
    return result;
}

/**
 * Cancellazione evento.
 * 
 * Se l'evento ha delle prenotazioni non può essere cancellato (viene restituito un errore 403 FORBIDDEN)
 * 
 * @param event_id L'id dell'evento da cancellare
 * @param res La risposta HTTP da inviare con il messaggio di successo o errore
 * 
 **/
export async function deleteEvent(event_id: number, res: any) {
    Event.findByPk(event_id, { raw: true }).then((event: any) => {
        if (event != null) {
            if (event.bookings == null) {
                Event.destroy({ where: { id: event_id } }).then(() => {
                    res.status(StatusCodes.OK).json({ message: "Event DELETED successfully" });
                }).catch((error) => {
                    res.status(StatusCodes.NOT_FOUND).json({ error: error });
                });
            }
            else {
                res.status(StatusCodes.FORBIDDEN).json({ error: "Event with bookings" });
            }
        }
        else {
            res.status(StatusCodes.NOT_FOUND).json({ error: "Event not found" });
        }
    }).catch((error) => {
        res.status(StatusCodes.NOT_FOUND).json({ error: error });
    });
}

/**
 * Ricerca stato di un evento.
 * 
 * Se l'evento non esiste viene restituito un errore 404 NOT FOUND
 * 
 * @param event_id L'id dell'evento da cercarne lo stato
 * @param res La risposta HTTP da inviare con il messaggio in caso errore
 * @returns lo stato dell'evento (0 = chiuso, 1 = aperto)
 * 
 **/
export async function getEventStatus(event_id: number, res: any): Promise<number> {
    let result: any;
    try {
        result = await Event.findByPk(event_id, { raw: true });
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({ error: error });
    }
    return result.status;
}

/**
 * Ricerca slot date-time di un evento.
 * 
 * Se l'evento non esiste viene restituito un errore 404 NOT FOUND
 * 
 * @param event_id L'id dell'evento da cercarne lo stato
 * @param res La risposta HTTP da inviare in caso di errore
 * @returns gli slot date-time dell'evento
 * 
 **/
export async function getEventDatetimes(event_id: number, res: any): Promise<any> {
    let result: any;
    try {
        result = await Event.findByPk(event_id, { raw: true });
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({ error: error });
    }
    return result.datetimes;
}

/**
 * Ricerca la modalità di un evento.
 * 
 * Se l'evento non esiste viene restituito un errore 404 NOT FOUND
 * 
 * @param event_id L'id dell'evento da cercarne lo stato
 * @param res La risposta HTTP da inviare in caso di errore
 * @returns la modalità dell'evento (1, 2 o 3)
 * 
 **/
export async function getEventMode(event_id: number, res: any): Promise<number> {
    let result: any;
    try {
        result = await Event.findByPk(event_id, { raw: true });
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({ error: error });
    }
    return result.mode;
}

/**
 * Prenotazione evento.
 * 
 * Una volta passati tutti i controlli di esistenza e proprietà dell'evento, viene aggiunta la prenotazione
 * Se l'evento non esiste viene restituito un errore 404 NOT FOUND
 * 
 * @param event_id L'id dell'evento da cercarne lo stato
 * @param email L'email dell'utente che prenota l'evento
 * @param datetimes Gli slot date-time scelti dall'utente
 * @param res La risposta HTTP da inviare in caso di successo o errore
 * 
 **/
export function bookEvent(event_id: number, email: string, datetimes: any, res: any): void {
    getEventBookings(event_id, res).then((bookings: any) => {
        for (let i = 0; i < datetimes.length; i++) {
            bookings.push({ user: email, datetimes: datetimes[i] });
        }
        Event.update({ bookings: bookings }, { where: { id: event_id } }).then(() => {
            res.status(StatusCodes.OK).json({ message: "Event booked successfully" });
        });
    }).catch((error) => {
        res.status(StatusCodes.NOT_FOUND).json({ error: error });
    });
}

/**
 * Ricerca tutte le date prenotate di un evento.
 * 
 * Serve per la modalità 2. Infatti, se l'evento è in modalità 2, l'utente può prenotare solo date non ancora prenotate
 * quindi viene restituito un array di date prenotate e poi si verifica se la data scelta dall'utente è già presente
 * 
 * @param event_id L'id dell'evento da cercarne le date prenotate
 * @param res La risposta HTTP da inviare in caso di errore
 * @returns le date prenotate dell'evento
 * 
 **/
export async function getBookingsSlots(event_id: number, res: any): Promise<object | null> {
    let bookings: any;
    try {
        bookings = await getEventBookings(event_id, res);
        // Trasforma il json in un array di date
        let onlyDates = bookings.map(o => {
            let obj = Object.assign({}, o);
            delete obj.user;
            return obj;
        });
        let dates: Date[] = [];
        onlyDates.forEach((element: Date) => {
            Object.keys(element).forEach((key: any) => {
                dates.push(new Date(element[key]));
            });
        });
        return dates;
    } catch (error) {
        return null;
    }
}
