const { Sequelize, Model, DataTypes } = require('sequelize');
const config = require('../config/db');
const sequelize = new Sequelize(config.db, config.username, config.password, {
    host:config.host,
    dialect: config.dialect,
    port:config.port
  });

sequelize.authenticate().
then(()=>{
  console.log('connected to db successfully');
}).
catch((err) =>{
  console.log(err);
})

class User extends Model {}
class Trainer extends Model {}
class Sport extends Model {}
class Session extends Model {}
class Train extends Model {}

User.init({
  name: DataTypes.STRING(50),
  email: DataTypes.STRING(50),
  password: DataTypes.STRING,
  token: DataTypes.STRING,
  age: DataTypes.INTEGER(3),
  gender: DataTypes.ENUM('male','female'),
  super: DataTypes.INTEGER(1),
}, { sequelize, modelName: 'users' });

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
  trainer_id: {
     type: DataTypes.INTEGER,
     references: {
          model: 'trainers', 
          key: 'id',  
      }
  }, 
  sport_id: {
     type: DataTypes.INTEGER,
     references: {
          model: 'sports', 
          key: 'id',  
      }
  }, 
  day: DataTypes.ENUM('Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'), 
  start_at:DataTypes.TIME,
  ends_at:DataTypes.TIME,
  
}, { sequelize, modelName: 'trains' });

Session.init({
  user_id: {
      type: DataTypes.INTEGER,
     references: {
          model: 'users', 
          key: 'id', 
      }
  }, 
  trainer_id: {
      type: DataTypes.INTEGER,
     references: {
          model: 'trainers', 
          key: 'id', 
      }
  }, 
  sport_id: {
      type: DataTypes.INTEGER,
     references: {
          model: 'sports', 
          key: 'id', 
      }
  }, 
  day: DataTypes.ENUM('Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'), 
  start_at:DataTypes.TIME,
  ends_at:DataTypes.TIME,
}, { sequelize, modelName: 'sessions'});

sequelize.sync();

module.exports = {
    sequelize,
    User,
    Trainer,
    Sport,
    Session,
    Train
};