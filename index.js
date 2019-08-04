'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const cors = require('cors');
const api = require('./routes/api');
const app = express();
const { userController } = require('./controllers/userController');
const { messageController } = require('./controllers/messageController');
const sqlite3 = require('sqlite3')  
var session = require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000*60*60 }
}))
// set the view engine to ejs
app.set('view engine', 'ejs');

const path = require('path');
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/api', api);


let port = process.env.PORT || config.PORT;
app.listen(port, () => {
    console.log(`Listening at port ${port}`);
}).on('error', function (error) {
    console.log(error);
});
let dbName=config.DB_URL;
this.db = new sqlite3.Database(dbName, (err) => {
    if (err) {
      console.log('Could not connect to database', err)
    } else {
      console.log('Connected to database')
    }
});

const sql = `
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullname TEXT,
    username TEXT,
    email TEXT,
    password TEXT)
    `
this.db.run(sql)
const sql101 = `
    CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT,
    sentBy TEXT,
    sentTo TEXT)
    `
this.db.run(sql101)

//Application routes
app.get('/', function(req, res) {
    var msg = '';
    res.render('pages/login',{msg:msg});
});
app.get('/signup-view', function(req, res) {
    var msg = '';
    res.render('pages/signup',{msg:msg});
});
app.get('/sample', function(req, res) {
    res.render('pages/sample');
});
app.get('/message-system', function(req, res) {
    var sessionObject={
        userId:req.session.userId,
        username:req.session.username,
        email:req.session.email,
        fullname:req.session.fullname
    }
    res.render('pages/system',{sessionObject:sessionObject});
});

app.get('/logout',userController.logout);
app.get('/compose-message',messageController.messageComposeView);
app.get('/sent-message', messageController.sentMessageView);
app.get('/received-message', messageController.receivedMessageView);

app.post('/login',userController.login);
app.post('/signup',userController.signup);
app.post('/message',messageController.sendMessage)


//app.delete('delete-message',messageController.deleteMessage);