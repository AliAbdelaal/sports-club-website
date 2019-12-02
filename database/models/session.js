const {sequelize,Model,DataTypes} = require('../connection');

class Session extends Model {}

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


Session.sync();

module.exports = Session;