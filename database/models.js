const {sequelize,Model,DataTypes} = require('../connection');
const crypto = require('crypto');
const config = require('../../config/server');

class User extends Model {}
class Sport extends Model {}
class Trainer extends Model {}
class Train extends Model {}
class Session extends Model {}

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
   user.password = crypto.createHmac('sha256',config.secret).update(user.password).digest('hex');
});

Trainer.init({
  name: DataTypes.STRING(50),
  email: DataTypes.STRING(50),
  token: DataTypes.STRING,
  password: DataTypes.STRING,
}, { sequelize, modelName: 'trainers' });

Sport.init({
  name: DataTypes.STRING, 
}, { sequelize, modelName: 'sports' });

Train.init({
  day: DataTypes.ENUM('Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'), 
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
Sport.hasMany(Session)
User.hasMany(Session);


sequelize.sync();

module.exports = {User,Sport,Train,Trainer,Session};