import { Router } from 'express';
import * as eventController from '../controller/controllerEvent';
import * as userController from '../controller/controllerUser';
import * as Middleware from '../middleware/CoR';

const router = Router();

router.post('/create-event', Middleware.createEvent, async (req: any, res: any) => {    
  eventController.createEvent(req, res);
});

router.get('/show-events-owner', Middleware.checkEventsOwner, function (req: any, res: any) {
  eventController.showEventsOwner(req.body.owner, res);
});

router.get('/show-bookings', Middleware.showBookings, async (req: any, res: any) => {
  eventController.getEventBookings(req.body.event_id, res);
});

// rotta non richiesta, ma utile per testare alcune funzionalità
router.get('/show-info-user', Middleware.checkInfoUser, function (req: any, res: any) {
  userController.userInfo(req.body.user, res);
});

router.post('/close-event', Middleware.closeEvent, async (req, res) => {
  eventController.closeEvent(req.body.event_id, res);
});

router.delete('/delete-event', Middleware.deleteEvent, async (req, res) => {
  eventController.deleteEvent(req.body.event_id, res);
});

router.post('/increment-token', Middleware.checkIncrementToken, Middleware.checkAdmin, async (req, res) => {
  userController.incrementToken(req.body.increment_user, req.body.increment_amount, res);
});
export default router;