const router = require('express').Router();
const {User} = require('../database/models');
const {register ,signin} = require('../middleware/trainee.auth.middleware');
const {logoutController,signinController,registerController} = require('../controllers/trainee.auth.controller');
const errorMiddleware = require('../middleware/trainee.error.middleware');
const createTokenMiddleware = require('../middleware/trainee.createToken.middelware');
const {validationResult} = require('express-validator');
const crypto = require('crypto');
const config = require('../config/server');



router.post('/register',register(),registerController);

router.post('/signin',signin(),signinController,createTokenMiddleware);

router.get('/logout',logoutController);


module.exports = router;