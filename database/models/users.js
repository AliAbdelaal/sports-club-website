const {sequelize,Model,DataTypes} = require('../connection');
const crypto = require('crypto');
const config = require('../../config/server');

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
  
User.beforeCreate((user)=>{
   user.password = crypto.createHmac('sha256',config.secret).update(user.password).digest('hex');
});

User.sync();

module.exports = {User};