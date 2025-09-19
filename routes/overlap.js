const express = require("express");
const overlapController = require("../controllers/overlapController");
const isAuth = require('../middleware/isAuth');
const isExpert = require("../middleware/isExpert");

const router = express.Router();

// Basic CRUD operations
router.get('/', isAuth, overlapController.all);
router.get('/:id', isAuth, overlapController.get);
router.post('/', isAuth, overlapController.create);
router.patch('/:id', isAuth, overlapController.update);
router.delete('/:id', isAuth, overlapController.delete);

router.get('/dashboard/stats', isExpert, overlapController.stats);

module.exports = router;
