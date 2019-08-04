'use strict';

const { Router } = require('express');
const { userController } = require('../controllers/userController');


const router = new Router();


//**User Auth routes */

router.post('/login',userController.login);


module.exports = router;