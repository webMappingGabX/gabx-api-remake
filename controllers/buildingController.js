const jwt = require('jsonwebtoken');
const { Building } = require('../models');
const SearchService = require('../services/searchService');
const { Op } = require('sequelize');

// get all buildings
exports.all = async (req, res) => {
    try {
        const {
            search,
            page = 1,
            limit = 10,
            sortBy = "code",
            sortOrder = "ASC"
        } = req.query;

        // Filtres exacts
        const where = {};

        //const buildings = await Building.findAll({ order: [['buildingname', 'ASC']] });
        const buildings = await SearchService.search(Building, {
            searchTerm: search,
            where,
            page: parseInt(page),
            limit: parseInt(limit),
            order: [[sortBy, sortOrder]]
        })
        
        res.status(200).json(buildings);
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.get = async (req, res) => {
    const { id } = req.params;

    try {
        const building = await Building.findOne({ where: { 'id': id } });

        if(building == null)
        {
            return res.status(404).json("Ce batiment n'existe pas");    
        }
        res.status(200).json(building);
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}


exports.create = async (req, res) => {
    const { code, geom, plotId } = req.body;

    try {
        const building = await Building.create({ code, geom, plotId });
        
        res.status(201).json({ message: "Batiment créé avec succès", "building": building });
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}


exports.update = async (req, res) => {
    
    const { id } = req.params;
    const { geom, code } = req.body;

    try {
        const building = await Building.findOne({ where: { "id": id }});
        
        if(building != null)
        {
            if(code != null) building.code = code;
            if(geom != null) building.geom = geom;

            building.save();
        
            res.status(200).json({ message: "Batiment modifié avec succès", "building": building });
        } else {
            return res.status(404).json({ message: "Batiment inexistant" });
        }
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}

// delete any building
exports.delete = async (req, res) => {

    const { id } = req.params;

    try {
        const deletedBuilding = await Building.destroy({ where: { "id": id }});

        if(deletedBuilding > 0)
        {
            res.status(200).json({ message: "Batiment supprimé avec succès" });
        }
        else res.status(404).json({ message: "Batiment inexistant" });
        
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}


// Get statistics about buildings
exports.stats = async (req, res) => {
    try {
        const totalBuildings = await Building.count();
        const buildingsWithGeom = await Building.count({ where: { geom: { [Op.ne]: null } } });
        const buildingsWithCode = await Building.count({ where: { code: { [Op.ne]: null } } });

        res.status(200).json({
            totalBuildings,
            buildingsWithGeom,
            buildingsWithCode
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
