const express = require("express");
const userController = require("../controllers/userController");
const activityController = require("../controllers/activityController");
const isAuth = require('../middleware/isAuth');
const isAdmin = require('../middleware/isAdmin');
const isExpert = require('../middleware/isExpert');

const router = express.Router();

router.get('/', isAdmin, userController.all);
router.get('/:id', isAdmin, userController.get);
router.get('/me', isAuth, userController.me);
router.post('/', isAdmin, userController.create);
router.patch('/:id', isAdmin, userController.update);
router.patch('/update-account', isAuth, userController.updateAccount);
router.delete('/:id', isAdmin, userController.delete);
router.delete('/delete-account', isAuth, userController.deleteAccount);
router.patch('/change-password', isAuth, userController.changeUserPassword);

router.get('/dashboard/stats', isExpert, userController.stats);

router.get('/dashboard/activity', isAdmin, activityController.recent);

module.exports = router;