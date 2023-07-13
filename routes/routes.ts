import { Router } from 'express';
import * as eventController from '../controller/controllerEvent';
import * as userController from '../controller/controllerUser';
import * as Middleware from '../middleware/CoR';
const router = Router();

router.post('/create-event', Middleware.createEvent, async (req: any, res: any) => {    
  eventController.createEvent(req.user, res);
});

router.get('/show-events-owner', function (req: any, res: any) {
  eventController.showEventsOwner(req.body.owner, res);
});

router.get('/show-bookings', Middleware.showBookings, async (req: any, res: any) => {
  eventController.getEventBookings(req.body.event_id, res);
});

router.get('/show-info-user', function (req: any, res: any) {
  userController.userInfo(req.body.email, res);
});

router.post('/close-event', Middleware.closeEvent, async (req, res) => {
  eventController.closeEvent(req.user.event_id, res);
});

router.post('/delete-event', Middleware.deleteEvent, async (req, res) => {
  eventController.deleteEvent(req.user.event_id, res);
});

router.post('/increment-token', Middleware.increaseToken, async (req, res) => {
  userController.incrementToken(req.user.increment_user, req.user.increment_amount, res);
});
export default router;