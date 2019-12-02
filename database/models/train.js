const {sequelize,Model,DataTypes} = require('../connection');

class Train extends Model {}

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


Train.sync();

module.exports = Train;