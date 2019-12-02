const express = require('express');
const path = require('path');
const serverConfig = require('./config/server');
const cookieParser  = require('cookie-parser');
const jwt = require('jsonwebtoken');
const hbs = require('express-handlebars');
const {initDB} = require('./database/connection');

const app = express();

app.use(express.static(path.resolve(__dirname,'./assets'),{cacheControl:true,maxAge:1000*60*60*24*10}));
app.use(cookieParser(serverConfig.secret));
app.engine('hbs',hbs({extname:'.html',partialsDir:'partials'}));
app.set('view engine','hbs');
app.set('views',path.resolve(__dirname,'./views'));

initDB();


app.listen(serverConfig.port,() =>{console.log(`server listening on port ${serverConfig.port}`);
});




