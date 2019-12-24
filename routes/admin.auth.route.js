const router = require('express').Router();
const {User} = require('../database/models');
const {register ,signin} = require('../middleware/admin.auth.middleware');
const {logoutController,signinController,registerController} = require('../controllers/admin.auth.controller');
const errorMiddleware = require('../middleware/admin.error.middleware');
const createTokenMiddleware = require('../middleware/admin.createToken.middelware');
const {validationResult} = require('express-validator');
const crypto = require('crypto');
const config = require('../config/server');


router.post('/register',register(),registerController);

router.post('/signin',signin(),signinController,createTokenMiddleware);

router.get('/logout',logoutController);

router.use(errorMiddleware);


module.exports = router;