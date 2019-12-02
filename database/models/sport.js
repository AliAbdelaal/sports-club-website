const {sequelize,Model,DataTypes} = require('../connection');

class Sport extends Model {}

Sport.init({
    name: DataTypes.STRING, 
  }, { sequelize, modelName: 'sports' });
  

Sport.sync();

module.exports = Sport;