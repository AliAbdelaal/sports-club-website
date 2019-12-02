const {sequelize,Model,DataTypes} = require('../connection');

class User extends Model {}

User.init({
    name: DataTypes.STRING(50),
    email: DataTypes.STRING(50),
    password: DataTypes.STRING,
    token: DataTypes.STRING,
    age: DataTypes.INTEGER(3),
    gender: DataTypes.ENUM('male','female'),
    super: DataTypes.INTEGER(1),
  }, { sequelize, modelName: 'users' });
  

User.sync();

module.exports = User;