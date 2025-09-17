const { Tenant, User, Building } = require('../models');
const Arrondissement = require('../models/Arrondissement');
const Department = require('../models/Department');
const Region = require('../models/Regions');
const Town = require('../models/Town');
const SearchService = require('../services/searchService');

//***  REGIONS ***//
// Get all regions
exports.regions = async (req, res) => {
    try {
        const {
            search,
            page = 1,
            limit = 1000,
            sortBy = "name",
            sortOrder = "ASC"
        } = req.query;
        
        const regions = await SearchService.search(Region, {
            searchTerm: search,
            page: parseInt(page),
            limit: parseInt(limit),
            order: [[sortBy, sortOrder]]
        });

        res.status(200).json(regions);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Get region by id
exports.getRegion = async (req, res) => {
    const { id } = req.params;

    try {
        const region = await Region.findOne({
            where: { id: id }
        });

        if (region == null) {
            return res.status(404).json("Cette region n'existe pas");
        }
        res.status(200).json(region);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


//***  DEPARTMENTS ***//
// Get departements
exports.departments = async (req, res) => {
    try {
        const {
            search,
            page = 1,
            limit = 1000,
            regionId,
            sortBy = "name",
            sortOrder = "ASC"
        } = req.query;
        
        // search
        // filtres exacts
        const where = {};
        if(regionId) where.regionId = regionId;

        const departments = await SearchService.search(Department, {
            searchTerm: search,
            page: parseInt(page),
            limit: parseInt(limit),
            include: [{
                model: Region,
            }],
            where,
            order: [[sortBy, sortOrder]]
        });

        res.status(200).json(departments);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Get department by id
exports.getDepartment = async (req, res) => {
    const { id } = req.params;

    try {
        const department = await Department.findOne({
            where: { id: id }
        });

        if (department == null) {
            return res.status(404).json("Ce departement n'existe pas");
        }
        res.status(200).json(department);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

//***  ARRONDISSEMENTS ***//
// Get arrondissements
exports.arrondissements = async (req, res) => {
    try {
        const {
            search,
            page = 1,
            limit = 1000,
            departmentId,
            sortBy = "name",
            sortOrder = "ASC"
        } = req.query;
        
        // search
        // filtres exacts
        const where = {};
        if(departmentId) where.departmentId = departmentId;

        const arrondissements = await SearchService.search(Arrondissement, {
            searchTerm: search,
            page: parseInt(page),
            limit: parseInt(limit),
            include: [{
                model: Department,
            }],
            where,
            order: [[sortBy, sortOrder]]
        });

        res.status(200).json(arrondissements);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Get arrondissement by id
exports.getArrondissement = async (req, res) => {
    const { id } = req.params;

    try {
        const arrondissement = await Arrondissement.findOne({
            where: { id: id }
        });

        if (arrondissement == null) {
            return res.status(404).json("Cet arrondissement n'existe pas");
        }
        res.status(200).json(arrondissement);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

//***  TOWNS ***//
// Get arrondissements
exports.towns = async (req, res) => {
    try {
        const {
            search,
            page = 1,
            limit = 1000,
            arrondissementId,
            sortBy = "name",
            sortOrder = "ASC"
        } = req.query;
        
        // search
        // filtres exacts
        const where = {};
        if(arrondissementId) where.arrondissementId = arrondissementId;

        const towns = await SearchService.search(Town, {
            searchTerm: search,
            page: parseInt(page),
            limit: parseInt(limit),
            include: [{
                model: Arrondissement,
            }],
            where,
            order: [[sortBy, sortOrder]]
        });

        res.status(200).json(towns);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Get town by id
exports.getTown = async (req, res) => {
    const { id } = req.params;

    try {
        const town = await Town.findOne({
            where: { id: id }
        });

        if (town == null) {
            return res.status(404).json("Cette ville n'existe pas");
        }
        res.status(200).json(town);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};