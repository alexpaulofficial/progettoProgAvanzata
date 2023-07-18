import * as middleAuth from './middlewareAuth';
import * as middleEvent from './middlewareEvent';

// Catena di middleware per l'autenticazione, verifica che l'utente sia loggato e che il token sia valido
// E' stata inserita qui per evitare di doverla ripetere in ogni middleware
export const middleAuthentication = [
    middleAuth.checkHeader,
    middleAuth.checkToken,
    middleAuth.verifyAndAuthenticate,
    middleAuth.checkUserReq
];

// Catena di middleware per la creazione di un evento, verifica che il body sia corretto
export const createEvent = [
    middleEvent.checkCreateEventBody
];

// Catena di middleware per la chiusura di un evento, verifica che il body sia corretto e che l'utente sia il proprietario
export const closeEvent = [
    middleEvent.checkEventIdBody,
    middleEvent.checkEventIsOwner
];

// Catena di middleware per l'eliminazione di un evento, verifica che il body sia corretto e che l'utente sia il proprietario
export const deleteEvent = [
    middleEvent.checkEventIdBody,
    middleEvent.checkEventIsOwner
];

// Catena di middleware per la visualizzazione delle prenotazioni di un evento, verifica che il body sia corretto
export const showBookings = [
    middleEvent.checkEventIdBody
];

// Middleware per verificare se un utente è admin
export const checkAdmin = [
    middleAuth.checkAdminReq
];

// Catena di middleware per la visualizzazione delle informazioni di un utente, verifica che il body sia corretto
// e che l'utente che effettua la richiesta sia admin
export const checkInfoUser = [
    middleAuth.checkAdminReq,
    middleEvent.checkUserInfoBody
];

// Middleware per la verifica del body della richiesta di aggiornamento del token
export const checkUpdateToken = [
    middleEvent.checkUpdateTokenBody
];

// Catena di middleware per la prenotazione di un evento, verifica che il body sia corretto, che l'evento esista
// che l'evento sia aperto, che le date siano corrette, che l'utente non abbia già prenotato l'evento e poi
// in base alla modalità dell'evento verifica che la prenotazione sia possibile
export const bookEvent = [
    middleEvent.checkBookEventBody,
    middleEvent.checkEventExistence,
    middleEvent.checkEventStatus,
    middleEvent.checkDatetimesExistence,
    middleEvent.checkBookingExistence,
    middleEvent.getEventMode,
    middleEvent.checkBookingSecondMode,
    middleEvent.checkBookingThirdMode
];