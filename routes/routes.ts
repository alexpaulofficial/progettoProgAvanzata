import { Router } from 'express';
import * as eventController from '../controller/controllerEvent';
import * as userController from '../controller/controllerUser';
import * as Middleware from '../middleware/CoR';
const router = Router();

router.post('/create-event', function (req: any, res: any) {    
  eventController.createEvent(req.body, res);
});

router.get('/show-events-owner', function (req: any, res: any) {
  eventController.showEventsOwner(req.body.owner, res);
});

router.get('/show-bookings', function (req: any, res: any) {
  eventController.getEventBookings(req.body.event_id, res);
});

router.get('/show-info-user', function (req: any, res: any) {
  userController.userInfo(req.body.email, res);
});

router.post('/close-event', Middleware.close_event, async (req, res) => {
  eventController.closeEvent(req.user.event_id, res);
});

export default router;