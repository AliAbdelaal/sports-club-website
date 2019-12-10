const router = require('express').Router();
const authRouter = require('./trainee.auth.route');
const errorMiddleware = require('../middleware/trainee.error.middleware');
const verifyTokenMiddleware = require('../middleware/trainee.verifytoken.middleware');
const traineeController = require("../controllers/trainee.controller");
const path = require('path');
const traineeViews = "trainee"+path.sep;


router.use('/auth',authRouter);

router.get('/register',async (req,res) =>{
    let errors = await req.consumeFlash('errors');
    if(errors){
        errors = errors[0];
    }
    console.log(errors);
    res.render(traineeViews+'registration',{layout:false,errors:errors?errors:null});
});

router.get('/signin',async (req,res)=>{
    let errors = await req.consumeFlash('errors');
    let success = await req.consumeFlash('success');
    if(success){
        success = success[0];
    }
    if(errors){
        errors = errors[0];
    }
    console.log(errors);
    console.log(success);
    res.render(traineeViews+'login',{layout:false,success,errors:errors?errors:null});
});

router.use(verifyTokenMiddleware);
router.post("/addreview",traineeController.addReview);
router.get('/dashboard',traineeController.dashboard);
router.get('/deletesession/:id',traineeController.deleteSession);
router.get('/catalog',traineeController.catalog);
router.get("/sport/:id",traineeController.sport);
router.get("/addsession/:id",traineeController.addSession);
router.get("/trainer/:id",traineeController.trainerView);

router.get('/',(req,res)=>{
    res.render(traineeViews+'trainee-index',{layout:false});
 });



router.use(errorMiddleware);

module.exports = router;