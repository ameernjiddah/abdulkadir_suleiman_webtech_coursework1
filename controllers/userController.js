//const { User } = require('./../schema/user');
const errorHandler = require('../utils/errorHandler');
const bcrypt = require('bcrypt');
//const { authMiddleware } = require('./../middleware/authMiddleware');
const ejs = require('ejs');
const uuidv1 = require('uuid/v1');
//const nodeMailer = require('./../utils/nodeMailer');
const config = require('./../config');
var validator = require('validator');
const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('encryption.db');
// var session = require('express-session');

class UserController {
    async login(req, res) {
        try {
            let username = req.body.username;
            let password = req.body.password;
            await db.get('SELECT * FROM users WHERE username = ?',[username],(err, rows ) => {
                if(rows)
                {
                    let comparison = bcrypt.compareSync(password, rows.password);
                    if(comparison)
                    {
                        
                        var sess = req.session;  //initialize session variable
                        req.session.userId = rows.id; //set user id
                        req.session.username = rows.username;//set user name
                        req.session.email = rows.email;
                        req.session.fullname= rows.fullname;
                        return res.redirect('/compose-message');
                    }
                    else
                    {

                        var msg = '';
                        msg = 'Wrong Credentials.';
                        return res.render('pages/login.ejs',{msg: msg});
                    }
                }  
                else
                {
                    var msg = '';
                    msg = 'No user found';
                    return res.render('pages/login.ejs',{msg: msg});
                } 
            });
        } catch (error) {
            errorHandler.sendError(res, error);
        }
    }
    async signup(req, res) {
            let fullName = req.body.fullName;
            let userName = req.body.userName;
            let email = req.body.email;
            let password = req.body.password;
            let emailCheck = validator.isEmail(email);
            if (emailCheck == false) {
                var msg = '';
                msg = 'Email not validate';
                return res.render('pages/signup.ejs',{msg: msg});
            }
            password = await bcrypt.hashSync(req.body.password, 8);
            db.get('SELECT * FROM users WHERE email = ?',[email],(err, rows ) => {
                if(rows)
                {
                    console.log(rows);
                    var msg = '';
                    msg = 'Email already exists';
                    res.render('pages/signup.ejs',{msg: msg});
                }
                else
                {
                    db.get('SELECT * FROM users WHERE username = ?',[userName],(err, rows ) => {
                        if(rows)
                        {
                            console.log(rows);
                            var msg = '';
                            msg = 'Username already exists';
                            res.render('pages/signup.ejs',{msg: msg});
                        }
                        else
                        {
                            db.run(`INSERT INTO users (fullname, username, email, password) VALUES (?, ?, ?, ?)`,[fullName, userName, email, password], (err, rows) => {
                                if (err) {
                                    var msg = '';
                                    msg = 'Error in database';
                                    res.render('pages/signup.ejs',{msg: msg});
                                }
                                else
                                {
                                    var msg = '';
                                    return res.render('pages/login.ejs',{msg:msg})
                                }
                            });
                        }
                    });
                }
            });
    }
    
    async logout(req, res) {
        try {
            req.session.destroy();
            return res.redirect('/');
        } catch (error) {
            errorHandler.sendError(res, error)
        }
    }
    
}

const userController = new UserController();
module.exports = { userController };