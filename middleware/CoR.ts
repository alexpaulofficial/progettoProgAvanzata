import * as middleAuth from './middlewareAuth';
import * as middleEvent from './middlewareEvent';

export const close_event = [
    middleAuth.checkHeader, 
    middleAuth.checkToken, 
    middleAuth.verifyAndAuthenticate,
    middleAuth.checkUserReq,
    middleEvent.checkEvent
];