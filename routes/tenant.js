const express = require("express");
const tenantController = require("../controllers/tenantController");
const isAuth = require('../middleware/isAuth');
const isExpert = require("../middleware/isExpert");

const router = express.Router();

// Basic CRUD operations
router.get('/', isAuth, tenantController.all);
router.get('/:id', isAuth, tenantController.get);
router.post('/', isAuth, tenantController.create);
router.patch('/:id', isAuth, tenantController.update);
router.delete('/:id', isAuth, tenantController.delete);

module.exports = router;
