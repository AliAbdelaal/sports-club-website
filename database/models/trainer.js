const {sequelize,Model,DataTypes} = require('../connection');

class Trainer extends Model {}

Trainer.init({
    name: DataTypes.STRING(50),
    email: DataTypes.STRING(50),
    token: DataTypes.STRING,
    password: DataTypes.STRING,
  }, { sequelize, modelName: 'trainers' });


Trainer.sync();

module.exports = Trainer;