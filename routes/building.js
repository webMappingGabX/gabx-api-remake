const express = require("express");
const buildingController = require("../controllers/buildingController");
const isAuth = require('../middleware/isAuth');
const isExpert = require("../middleware/isExpert");

const router = express.Router();

// Basic CRUD operations
router.get('/', isAuth, buildingController.all);
router.get('/:id', isAuth, buildingController.get);
router.post('/', isExpert, buildingController.create);
router.patch('/:id', isExpert, buildingController.update);
router.delete('/:id', isExpert, buildingController.delete);
router.get('/dashboard/stats', isExpert, buildingController.stats);

module.exports = router;
