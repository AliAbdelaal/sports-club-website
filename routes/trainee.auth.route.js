const router = require('express').Router();
const {User} = require('../database/models/users');
const {register ,signin} = require('../middleware/trainee.auth.middleware');
const {logoutController,signinController,registerController} = require('../controllers/trainee.auth.controller');
const errorMiddleware = require('../middleware/trainee.error.middleware');
const createTokenMiddleware = require('../middleware/trainee.createToken.middelware');
const logoutMiddleware = require('../middleware/trainee.logout.middleware');
const {validationResult} = require('express-validator');
const crypto = require('crypto');
const config = require('../config/server');



router.post('/register',register(),registerController);

router.post('/signin',signin(),signinController,createTokenMiddleware);

router.get('/logout',logoutMiddleware,logoutMiddleware);

router.use(errorMiddleware);

router.use((req)=>{

})

module.exports = router;