const {sequelize,Model,DataTypes} = require('./connection');
const crypto = require('crypto');
const config = require('../config/db');
const serverConfig = require("../config/server");

class User extends Model {}
class Sport extends Model {}
class Trainer extends Model {}
class Train extends Model {}
class Session extends Model {}
class TrainerReviews extends Model{}

User.init({
    name: DataTypes.STRING(50),
    email: DataTypes.STRING(50),
    password: DataTypes.STRING,
    token: DataTypes.STRING,
    age: DataTypes.INTEGER(3),
    gender: DataTypes.ENUM('male','female'),
    super: DataTypes.INTEGER(1),
  }, { sequelize, modelName: 'users' });
  
User.beforeCreate((user)=>{
   user.password = crypto.createHmac('sha256',serverConfig.secret).update(user.password).digest('hex');
});

Trainer.init({
  name: DataTypes.STRING(50),
  email: DataTypes.STRING(50),
  description:DataTypes.STRING,
  experience:DataTypes.ENUM("less than one year","1 years","2 years" ,"3 years","4 years","5 years","more than 5 years"), 
  previous_jobs:DataTypes.JSON
}, { sequelize, modelName: 'trainers' });

Sport.init({
  name: DataTypes.STRING, 
}, { sequelize, modelName: 'sports' });

Train.init({
  name: DataTypes.STRING(50),
  day: DataTypes.ENUM('Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'),
  description:DataTypes.STRING,
  level:DataTypes.ENUM('Beginner','Intermediate','Advanced'),
  price:DataTypes.FLOAT,
  start_at:DataTypes.TIME,
  ends_at:DataTypes.TIME,
}, { sequelize, modelName: 'trains' });

Train.belongsTo(Sport,{onDelete:"CASCADE"});
Train.belongsTo(Trainer,{onDelete:"CASCADE"});
Sport.hasMany(Train);
Trainer.hasMany(Train);

Session.init({
  day: DataTypes.ENUM('Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'), 
  start_at:DataTypes.TIME,
  ends_at:DataTypes.TIME,
}, { sequelize, modelName: 'sessions'});


Session.belongsTo(User,{onDelete:"CASCADE"});
Session.belongsTo(Trainer,{onDelete:"CASCADE"});
Session.belongsTo(Sport,{onDelete:"CASCADE"});
Trainer.hasMany(Session);
Sport.hasMany(Session);
User.hasMany(Session);

TrainerReviews.init({
description:{
  type:DataTypes.STRING,
  validate:{
    len:[15,255]
  }
},
rating:{
  type:DataTypes.INTEGER,
  validate:{
    min:{
      args:[1],
      msg:"minimum rating is 1 star"
    },
    max:{
      args:[5],
      msg:"maximum rating is 5 stars"
    }
  }
},
userId:{
 type:DataTypes.INTEGER,
 references:{
  model:User,
  key:'id', 
 },
 primaryKey:true
},
sportId:{
  type:DataTypes.INTEGER,
  references:{
   model:Sport,
   key:'id', 
  },
  primaryKey:true
},
trainerId:{
  type:DataTypes.INTEGER,
  references:{
   model:Trainer,
   key:'id', 
  },
  primaryKey:true
}
},{sequelize,modelName:"trainerreviews"});

sequelize.sync();


module.exports = {User,Sport,Train,Trainer,Session,TrainerReviews,sequelize};
