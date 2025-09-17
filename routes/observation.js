const express = require("express");
const observationController = require("../controllers/observationController");
const isAuth = require('../middleware/isAuth');
const isExpert = require("../middleware/isExpert");

const router = express.Router();

// Basic CRUD operations
router.get('/', isAuth, observationController.all);
router.get('/:id', isAuth, observationController.get);
router.post('/', isAuth, observationController.create);
router.patch('/:id', isAuth, observationController.update);
router.delete('/:id', isAuth, observationController.delete);

module.exports = router;
