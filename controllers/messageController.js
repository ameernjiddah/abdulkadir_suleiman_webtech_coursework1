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

class MessageController {
    async messageComposeView(req, res) {
        try {
            await db.all('SELECT id,fullname,username FROM users WHERE id != ?',[req.session.userId],(err, rows ) => {
                if(rows)
                {   
                    var sessionObject={
                        userId:req.session.userId,
                        username:req.session.username,
                        email:req.session.email,
                        fullname:req.session.fullname
                    }
                    res.render('pages/compose-message',{sessionObject:sessionObject,rows:rows});
                    
                }  
                else
                {
                    var sessionObject={
                        userId:req.session.userId,
                        username:req.session.username,
                        email:req.session.email,
                        fullname:req.session.fullname
                    }
                    res.render('pages/compose-message',{sessionObject:sessionObject});
                } 
            });
        } catch (error) {
            errorHandler.sendError(res, error);
        }
    }
    async sendMessage(req, res) {
        try {
            let sentBy = req.body.sentBy;
            let sentTo = req.body.sentTo;
            let message = req.body.message;
            await db.serialize(() => {
                 db.run(`INSERT INTO messages (message, sentBy, sentTo)
                        VALUES (?, ?, ?)`,[message, sentBy, sentTo], (err, rows) => {
                    if (err) {
                        var msg = '';
                        msg = 'Error in database';
                        return res.render('pages/compose-message.ejs',{msg: msg});
                    }
                    else
                    {
                        return res.redirect('/sent-message')
                    }
                });
            });
            
        } catch (error) {
            errorHandler.sendError(res, error);
        }
    }
    async sentMessageView(req, res)
    {
        try{
            await db.all('SELECT * FROM messages WHERE sentBy = ?',[req.session.username],(err, rows ) => {
                var sessionObject={
                    userId:req.session.userId,
                    username:req.session.username,
                    email:req.session.email,
                    fullname:req.session.fullname
                }
                return res.render('pages/sent-messages',{rows: rows,sessionObject:sessionObject});
            });
        }
        catch(error){
            errorHandler.sendError(res,error)
        }
    }
    async receivedMessageView(req, res)
    {
        try{
            await db.all('SELECT * FROM messages WHERE sentTo = ?',[req.session.username],(err, rows ) => {
                var sessionObject={
                    userId:req.session.userId,
                    username:req.session.username,
                    email:req.session.email,
                    fullname:req.session.fullname
                }
                return res.render('pages/receive-messages',{rows: rows,sessionObject:sessionObject});
            });
        }
        catch(error){
            errorHandler.sendError(res,error)
        }
    }
    // async deleteMessage(req,res,id)
    // {
    //     let id =id;
    //     console.log(id)
    // }
    
}

const messageController = new MessageController();
module.exports = { messageController };