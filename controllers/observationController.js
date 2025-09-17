const { Observation, User } = require('../models');
const SearchService = require('../services/searchService');

// Get all observations
exports.all = async (req, res) => {
    try {
        const {
            search,
            page = 1,
            limit = 10,
            category,
            sortBy = "category",
            sortOrder = "ASC"
        } = req.query;

        // search
        // filtres exacts
        const where = {};
        if(category) where.category = category;
        
        const observations = await SearchService.search(Observation, {
            searchTerm: search,
            page: parseInt(page),
            limit: parseInt(limit),
            where,
            include: [{
                model: User,
                required: false
            }],
            order: [[sortBy, sortOrder]]
        });

        res.status(200).json(observations);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Get observation id
exports.get = async (req, res) => {
    const { id } = req.params;

    try {
        const observation = await Observation.findOne({
            where: { id: id },
            include: [{
                model: User,
                required: false
            }]
        });

        if (observation == null) {
            return res.status(404).json("Cette observation n'existe pas");
        }
        res.status(200).json(observation);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Create new observation
exports.create = async (req, res) => {
    const {
        category,
        scale,
        content,
        userId
    } = req.body;

    try {
        const observation = await Observation.create({
            category,
            scale,
            content,
            userId
        });

        res.status(201).json({ message: "Observation créée avec succès", observation: observation });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Update observation
exports.update = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const observation = await Observation.findOne({ where: { id: id } });

        if (observation != null) {
            // Update only provided fields
            Object.keys(updateData).forEach(key => {
                if (updateData[key] != null && observation.hasOwnProperty(key)) {
                    observation[key] = updateData[key];
                }
            });

            await observation.save();
            res.status(200).json({ message: "Observation modifiée avec succès", observation: observation });
        } else {
            return res.status(404).json({ message: "Observation inexistante" });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Delete observation
exports.delete = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedObservation = await Observation.destroy({ where: { id: id } });

        if (deletedObservation > 0) {
            res.status(200).json({ message: "Observation supprimée avec succès" });
        } else {
            res.status(404).json({ message: "Observation inexistante" });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Get observations by categories
exports.getByCategory = async (req, res) => {
    const { category } = req.params;

    try {
        const observations = await Observation.findAll({
            where: { category: category },
            order: [['category', 'ASC']]
        });
        res.status(200).json(observations);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Get observations by user
exports.getByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const observations = await Observation.findAll({
            where: { userId: userId },
            order: [['category', 'ASC']]
        });
        res.status(200).json(observations);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
