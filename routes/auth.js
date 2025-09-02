const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refreshToken);
router.post('/send-reset-code', authController.sendResetCode);
router.post('/verify-code', authController.verifyCode);
router.post('/reset-password', authController.resetPassword);

module.exports = router;