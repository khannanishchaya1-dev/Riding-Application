const express= require('express');
const router= express.Router();
const {body} = require('express-validator');
const { authUser } = require('../middlewares/auth');
router.post('/create-ride',body('userId').isMongoId().isLength({min:24,max:24}).withMessage('Invalid User ID'),body('origin').isString().notEmpty().withMessage('Origin is required'),body('destination').isString().notEmpty().withMessage('Destination is required'),authUser,);

module.exports=router;