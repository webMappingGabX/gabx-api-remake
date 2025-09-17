const express = require("express");
const camerGeoController = require("../controllers/camerGeoController");

const router = express.Router();

// Basic CRUD operations
router.get('/regions', camerGeoController.regions);
router.get('/regions/:id', camerGeoController.getRegion);
router.get('/departments', camerGeoController.departments);
router.get('/departments/:id', camerGeoController.getDepartment);
router.get('/arrondissements', camerGeoController.arrondissements);
router.get('/arrondissements/:id', camerGeoController.getArrondissement);
router.get('/towns', camerGeoController.towns);
router.get('/towns/:id', camerGeoController.getTown);

module.exports = router;
