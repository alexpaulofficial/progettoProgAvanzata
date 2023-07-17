import * as middleAuth from './middlewareAuth';
import * as middleEvent from './middlewareEvent';

export const middleAuthorization = [
    middleAuth.checkHeader,
    middleAuth.checkToken,
    middleAuth.verifyAndAuthenticate,
    middleAuth.checkUserReq
];

// verificare il token nel middleware
export const createEvent = [
    middleEvent.checkCreateEventBody
];

export const closeEvent = [
    middleEvent.checkEventIdBody,
    middleEvent.checkEventIsOwner
];

export const deleteEvent = [
    middleEvent.checkEventIdBody,
    middleEvent.checkEventIsOwner
];

export const showBookings = [
    middleEvent.checkEventIdBody
];

export const checkAdmin = [
    middleAuth.checkAdminReq
];

export const checkInfoUser = [
    middleAuth.checkAdminReq,
    middleEvent.checkUserInfoBody
];

export const checkIncrementToken = [
    middleEvent.checkIncrementTokenBody
];

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