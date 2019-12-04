const {Sequelize, Model, DataTypes } = require('sequelize');
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

module.exports = {
    sequelize,
    Model,
    DataTypes

};