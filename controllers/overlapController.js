const { Overlap, Plot } = require('../models');
const SearchService = require('../services/searchService');

// Get all overlaps
exports.all = async (req, res) => {
    try {
        const {
            search,
            page = 1,
            limit = 10,
            sortBy = "id",
            sortOrder = "ASC"
        } = req.query;

        // search
        // filtres exacts
        const where = {};
        
        const overlaps = await SearchService.search(Overlap, {
            searchTerm: search,
            page: parseInt(page),
            limit: parseInt(limit),
            where,
            include: [{
                model: Plot,
                required: false
            }],
            order: [[sortBy, sortOrder]]
        });

        res.status(200).json(overlaps);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Get overlap id
exports.get = async (req, res) => {
    const { id } = req.params;

    try {
        const overlap = await Overlap.findOne({
            where: { id: id },
            include: [{
                model: Plot,
                required: false
            }]
        });

        if (overlap == null) {
            return res.status(404).json("Cet empietement n'existe pas");
        }
        res.status(200).json(overlap);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Create new overlap
exports.create = async (req, res) => {
    const {
        geom,
        area,
        plotId
    } = req.body;

    try {
        const overlap = await Overlap.create({
            geom,
            area,
            plotId
        });

        res.status(201).json({ message: "Empietement créé avec succès", overlap: overlap });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Update overlap
exports.update = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const overlap = await Overlap.findOne({ where: { id: id } });

        if (overlap != null) {
            // Update only provided fields
            Object.keys(updateData).forEach(key => {
                if (updateData[key] != null && overlap.hasOwnProperty(key)) {
                    overlap[key] = updateData[key];
                }
            });

            await overlap.save();
            res.status(200).json({ message: "Empietement modifié avec succès", overlap: overlap });
        } else {
            return res.status(404).json({ message: "Empietement inexistant" });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Delete overlap
exports.delete = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedOverlap = await Overlap.destroy({ where: { id: id } });

        if (deletedOverlap > 0) {
            res.status(200).json({ message: "Empietement supprimé avec succès" });
        } else {
            res.status(404).json({ message: "Empietement inexistant" });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};