const express = require("express");
const userController = require("../controllers/userController");
const isAuth = require('../middleware/isAuth');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

router.get('/', isAdmin, userController.all);
router.get('/:id', isAuth, userController.get);
router.post('/', isAdmin, userController.create);
router.patch('/:id', isAdmin, userController.update);
router.patch('/update-account', isAuth, userController.updateAccount);
router.delete('/:id', isAdmin, userController.delete);
router.delete('/delete-account', isAuth, userController.deleteAccount);
router.patch('/change-password', isAuth, userController.changeUserPassword);

module.exports = router;