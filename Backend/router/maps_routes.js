const express = require('express');
const router = express.Router();
const {authUser}= require('../middlewares/auth');
const mapController=require('../controllers/maps');
const {query}=require('express-validator');

router.get('/get-coordinates',query('address').isString().notEmpty(),authUser,mapController.getCoordinates);
router.get('/get-distance-time',query('origin').isString().notEmpty(),query('destination').isString().notEmpty(),authUser,mapController.getDistanceTime);
router.get('/get-suggestions',query('input').isString().notEmpty(),authUser,mapController.getSuggestions);



module.exports=router;