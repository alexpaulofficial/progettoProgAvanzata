import { Router } from 'express';
import * as eventController from '../controller/controllerEvent';
import * as userController from '../controller/controllerUser';
import * as Middleware from '../middleware/CoR';
import * as MiddlewareEvent from '../middleware/middlewareEvent';

const router = Router();

router.post('/create-event', Middleware.middleAuthorization, Middleware.createEvent, async (req: any, res: any) => {    
  eventController.createEvent(req, res);
});

router.get('/show-events', Middleware.middleAuthorization, function (req: any, res: any) {
  eventController.showEventsOwner(req.user.email, res);
});

router.get('/show-bookings', Middleware.middleAuthorization, Middleware.showBookings, async (req: any, res: any) => {
  MiddlewareEvent.middleEventBookings(req.body.event_id, res);
});

// rotta non richiesta, ma utile per testare alcune funzionalità
router.get('/show-info-user', Middleware.middleAuthorization, Middleware.checkInfoUser, function (req: any, res: any) {
  userController.userInfo(req.body.user, res);
});

router.post('/close-event', Middleware.middleAuthorization, Middleware.closeEvent, async (req, res) => {
  eventController.closeEvent(req.body.event_id, res);
});

router.delete('/delete-event', Middleware.middleAuthorization, Middleware.deleteEvent, async (req, res) => {
  eventController.deleteEvent(req.body.event_id, res);
});

router.post('/increment-token', Middleware.middleAuthorization, Middleware.checkIncrementToken, Middleware.checkAdmin, async (req, res) => {
  userController.incrementToken(req.body.increment_user, req.body.increment_amount, res);
});

router.post('/book-event', Middleware.middleAuthorization, Middleware.bookEvent, async (req, res) => {
  eventController.bookEvent(req.body.event_id, req.user.email, req.body.datetimes, res);
});
export default router;