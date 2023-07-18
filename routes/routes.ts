import { Router } from 'express';
import * as eventController from '../controller/controllerEvent';
import * as userController from '../controller/controllerUser';
import * as Middleware from '../middleware/CoR';
import * as MiddlewareEvent from '../middleware/middlewareEvent';

const router = Router();

router.post('/create-event', Middleware.middleAuthentication, Middleware.createEvent, async (req: any, res: any) => {
  eventController.createEvent(req, res);
});

router.get('/show-events', Middleware.middleAuthentication, function (req: any, res: any) {
  eventController.showEventsOwner(req.user.email, res);
});

router.get('/show-bookings', Middleware.middleAuthentication, Middleware.showBookings, async (req: any, res: any) => {
  MiddlewareEvent.checkEventBookings(req, res);
});

// Rotta non richiesta, ma utile per testare alcune funzionalità
router.get('/show-info-user', Middleware.middleAuthentication, Middleware.checkInfoUser, function (req: any, res: any) {
  userController.userInfo(req.body.user, res);
});

router.post('/close-event', Middleware.middleAuthentication, Middleware.closeEvent, async (req, res) => {
  eventController.closeEvent(req.body.event_id, res);
});

router.delete('/delete-event', Middleware.middleAuthentication, Middleware.deleteEvent, async (req, res) => {
  eventController.deleteEvent(req.body.event_id, res);
});

router.post('/update-token', Middleware.middleAuthentication, Middleware.checkAdmin, Middleware.checkUpdateToken, async (req, res) => {
  userController.updateToken(req.body.update_user, req.body.update_amount, res);
});

router.post('/book-event', Middleware.middleAuthentication, Middleware.bookEvent, async (req, res) => {
  eventController.bookEvent(req.body.event_id, req.user.email, req.body.datetimes, res);
});
export default router;