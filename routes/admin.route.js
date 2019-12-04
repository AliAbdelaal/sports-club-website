const router = require('express').Router();
const authRouter = require('./admin.auth.route');
const errorMiddleware = require('../middleware/trainee.error.middleware');
const verifyTokenMiddleware = require('../middleware/admin.verifyToken.middleware');
const path = require('path');
const adminViews = "admin" + path.sep;


router.use('/auth', authRouter);

router.get('/register', async(req, res) => {
    let errors = await req.consumeFlash('errors');
    if (errors) {
        errors = errors[0];
    }
    console.log(errors);
    res.render(traineeViews + 'registration', { layout: false, errors: errors ? errors : null });
});

router.get('/signin', async(req, res) => {
    let errors = await req.consumeFlash('errors');
    if (errors) {
        errors = errors[0];
    }
    console.log(errors);
    res.render(adminViews + 'login', { layout: false, errors: errors ? errors : null });
});

router.use(verifyTokenMiddleware);

router.get('/dashboard', async(req, res) => {
    console.log(req.signedCookies['token']);
    console.log('nice sign in');
    res.render(adminViews + 'panel', { layout: false });
});

router.get('/', (req, res) => {
    res.render(adminViews + 'panel', { layout: false });
});

router.use(errorMiddleware);

module.exports = router;