const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const auth = require('../middleware/auth');


router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);

//agregar mas rutas

module.exports = router;
