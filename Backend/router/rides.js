const express= require('express');
const router= express.Router();
const {body} = require('express-validator');
const {query}=require('express-validator');
const { authUser, authCaptain } = require('../middlewares/auth');
const {createRide} = require('../controllers/ride');
const rideController=require('../controllers/ride');

router.post('/create-ride',body('origin').isString().notEmpty().withMessage('Origin is required'),body('destination').isString().notEmpty().withMessage('Destination is required'),body('vehicleType').isString().isIn(['car', 'auto', 'moto']).notEmpty().withMessage('Vehicle type is required'),authUser,createRide);

router.get('/calculate-fare',query('origin').isString().notEmpty().withMessage('Origin is required'),query('destination').isString().notEmpty().withMessage('Destination is required'),authUser,rideController.calculateFare);

router.post('/confirm-ride',body('rideId').isMongoId().withMessage("Invalid Ride Id"),
authCaptain,rideController.confirmRide);
router.get('/start-ride',authCaptain,query('rideId').isMongoId().withMessage('Invalid ride id'),query('otp').isString().isLength({min:6,max:6}).withMessage('Invalid Otp'),rideController.startRide);
router.post('/end-ride',body('rideId').isMongoId().withMessage('invalid rideId'),authCaptain,rideController.endRide);
router.post('/find-rides',body('user_id').isMongoId().withMessage('invalid userId'),authUser,rideController.findRide);
router.post('/find-captain-rides',body('captain_id').isMongoId().withMessage('invalid captain_id'),authCaptain,rideController.findCaptainRide);

module.exports=router;