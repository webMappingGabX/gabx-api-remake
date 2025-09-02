const express = require("express");
const plotController = require("../controllers/plotController");
const isAuth = require('../middleware/isAuth');
const isExpert = require("../middleware/isExpert");

const router = express.Router();

// Basic CRUD operations
router.get('/', isAuth, plotController.all);
router.get('/:code', isAuth, plotController.get);
router.post('/', isExpert, plotController.create);
router.put('/:code', isExpert, plotController.update);
router.delete('/:code', isExpert, plotController.delete);

// Additional query endpoints
router.get('/housing-estate/:housingEstateId', isAuth, plotController.getByHousingEstate);
router.get('/region/:region', isAuth, plotController.getByRegion);
router.get('/status/:status', isAuth, plotController.getByStatus);

module.exports = router;
