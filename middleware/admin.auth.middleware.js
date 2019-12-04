const {body} = require('express-validator');
const {User} = require('../database/models');

const register = ()=>{
    return [
        body('name').exists().withMessage('name is required').trim().isLength({min:5}).withMessage("length must be atleast 8 charchaters"),
        body('email').exists().withMessage('email is required').trim().isEmail().custom(value =>{
            return User.findOne({where:{
             email:value   
            }}).then(user=>{
            if(user)
            return Promise.reject('Email already in use');
            });
        }),
        body('password1').exists().withMessage('first password is required').trim().isLength({min:5}).withMessage("first Password must be at least 8 charchaters"),
        body('password2').exists().withMessage('second password is required').trim().isLength({min:5}).withMessage("second Password must be at least 8 charchaters").custom((val,{req})=>{
           if(val != req.body.password2)
              throw new Error('the two passwords must match');
            return true;
        }),
        body('age').exists().withMessage('age is required').toInt().custom(value =>{
            if(value < 18 || value > 90)
               throw new Error('invalid age');
            return true;
        }).withMessage('please enter a valid age (above 18)'),
        body('gender').exists().withMessage('gender is required').trim().isIn(['male','female']),
    ];
}

const signin = ()=> [
  body('email').exists().withMessage('email is required').isEmail().withMessage('enter a valid email'),
  body('password').exists().withMessage('password is required').trim().isLength({min:5}).withMessage("Password must be at least 5 charchaters")
]


module.exports ={
    register,signin
}
