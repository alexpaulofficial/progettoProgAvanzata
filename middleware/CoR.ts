import * as middleAuth from './middlewareAuth';
import * as middleEvent from './middlewareEvent';

// verificare il token nel middleware
export const createEvent = [
    middleAuth.checkHeader, 
    middleAuth.checkToken, 
    middleAuth.verifyAndAuthenticate,
    middleAuth.checkUserReq
];

export const closeEvent = [
    middleAuth.checkHeader, 
    middleAuth.checkToken, 
    middleAuth.verifyAndAuthenticate,
    middleAuth.checkUserReq,
    middleEvent.checkEvent
];

export const deleteEvent = [
    middleAuth.checkHeader, 
    middleAuth.checkToken, 
    middleAuth.verifyAndAuthenticate,
    middleAuth.checkUserReq,
    middleEvent.checkEvent
];

export const showBookings = [
    middleAuth.checkHeader, 
    middleAuth.checkToken, 
    middleAuth.verifyAndAuthenticate
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
    middleAuth.checkOwnerReq
];

