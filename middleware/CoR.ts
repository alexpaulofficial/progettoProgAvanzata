import * as middleAuth from './middlewareAuth';
import * as middleEvent from './middlewareEvent';

// verificare il token nel middleware
export const createEvent = [
    middleAuth.checkHeader, 
    middleAuth.checkToken, 
    middleAuth.verifyAndAuthenticate,
    middleAuth.checkUserReq,
    middleEvent.checkCreateEventBody
];

export const closeEvent = [
    middleAuth.checkHeader, 
    middleAuth.checkToken, 
    middleAuth.verifyAndAuthenticate,
    middleAuth.checkUserReq,
    middleEvent.checkEventIdBody,
    middleEvent.checkEvent
];

export const deleteEvent = [
    middleAuth.checkHeader, 
    middleAuth.checkToken, 
    middleAuth.verifyAndAuthenticate,
    middleAuth.checkUserReq,
    middleEvent.checkEventIdBody,
    middleEvent.checkEvent
];

export const showBookings = [
    middleAuth.checkHeader, 
    middleAuth.checkToken, 
    middleAuth.verifyAndAuthenticate,
    middleEvent.checkEventIdBody
];

export const checkAdmin = [
    middleAuth.checkHeader, 
    middleAuth.checkToken, 
    middleAuth.verifyAndAuthenticate,
    middleAuth.checkUserReq,
    middleAuth.checkAdminReq
];

export const checkEventsOwner = [
    middleAuth.checkHeader, 
    middleAuth.checkToken, 
    middleAuth.verifyAndAuthenticate,
    middleAuth.checkUserReq,
    middleEvent.checkEventsOwnerBody,
    middleAuth.checkOwnerReq
];

export const checkInfoUser = [
    middleAuth.checkHeader, 
    middleAuth.checkToken, 
    middleAuth.verifyAndAuthenticate,
    middleAuth.checkUserReq,
    middleAuth.checkAdminReq,
    middleEvent.checkUserInfoBody
];

export const checkIncrementToken = [
    middleEvent.checkIncrementTokenBody
];
