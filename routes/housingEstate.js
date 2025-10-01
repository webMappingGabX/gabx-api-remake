const express = require("express");
const housingEstateController = require("../controllers/housingEstateController");
const isAuth = require('../middleware/isAuth');
const isExpert = require("../middleware/isExpert");

const router = express.Router();

// Basic CRUD operations
// router.get('/', isAuth, housingEstateController.all);
router.get('/', housingEstateController.all);
router.get('/:id', isAuth, housingEstateController.get);
router.post('/', isExpert, housingEstateController.create);
router.patch('/:id', isExpert, housingEstateController.update);
router.delete('/:id', isExpert, housingEstateController.delete);

// Additional endpoints
// router.get('/:id([0-9a-fA-F-]+)/stats', isAuth, housingEstateController.getStats);
router.get('/any/:id/stats', isAuth, housingEstateController.getStats);
router.get('/region/:region', isAuth, housingEstateController.getByRegion);

router.get('/dashboard/stats', isExpert, housingEstateController.stats);

module.exports = router;
