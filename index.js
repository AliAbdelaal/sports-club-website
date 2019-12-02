const express = require('express');
const path = require('path');
const serverConfig = require('./config/server');
const cookieParser  = require('cookie-parser');
const {flash} = require('express-flash-message');
const session  = require('express-session');
const hbs = require('express-handlebars');
const trainee = require('./routes/trainee.route');

const app = express();

app.use(express.static(path.resolve(__dirname,'./assets'),{cacheControl:true,maxAge:1000*60*60*24*10}));
app.use(cookieParser(serverConfig.secret));
app.use(session({cookie:{maxAge:6000}}));
app.use(flash({sessionKeyName:'flashmessages'}));
app.use(express.urlencoded());
app.use(express.json());
app.engine('hbs',hbs({extname:'.html'}));
app.set('view engine','hbs');
app.set('views',path.resolve(__dirname,'./views'));


app.use('/trainee',trainee);


app.use((req,res)=>{
    res.render("trainee/"+'trainee-index',{layout:false});
 });

app.listen(serverConfig.port,() =>{console.log(`server listening on port ${serverConfig.port}`);});


