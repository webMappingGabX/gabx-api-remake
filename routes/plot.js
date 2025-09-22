const express = require("express");
const plotController = require("../controllers/plotController");
const isAuth = require('../middleware/isAuth');
const isExpert = require("../middleware/isExpert");

const router = express.Router();

// Basic CRUD operations
router.get('/', isAuth, plotController.all);
router.get('/:id', isAuth, plotController.get);
//router.get('/:code', isAuth, plotController.getByCode);
router.post('/', isExpert, plotController.create);
router.patch('/:code', isExpert, plotController.update);
router.delete('/:code', isExpert, plotController.delete);

// Additional query endpoints
router.get('/housing-estate/:housingEstateId', isAuth, plotController.getByHousingEstate);
router.get('/region/:region', isAuth, plotController.getByRegion);
router.get('/status/:status', isAuth, plotController.getByStatus);

router.get('/dashboard/stats', isExpert, plotController.stats);

module.exports = router;
