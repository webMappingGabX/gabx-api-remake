const { Tenant, User, Building } = require('../models');
const SearchService = require('../services/searchService');

// Get all tenants
exports.all = async (req, res) => {
    try {
        const {
            search,
            page = 1,
            limit = 10,
            residencyCode,
            sortBy = "id",
            sortOrder = "ASC"
        } = req.query;

        // search
        // filtres exacts
        const where = {};
        if(residencyCode) where.residencyCode = residencyCode;
        
        const tenants = await SearchService.search(Tenant, {
            searchTerm: search,
            page: parseInt(page),
            limit: parseInt(limit),
            where,
            include: [{
                model: Building,
                required: false
            }],
            order: [[sortBy, sortOrder]]
        });

        res.status(200).json(tenants);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Get tenant id
exports.get = async (req, res) => {
    const { id } = req.params;

    try {
        const tenant = await Tenant.findOne({
            where: { id: id },
            include: [{
                model: Building,
                required: false
            }]
        });

        if (tenant == null) {
            return res.status(404).json("Ce locataire n'existe pas");
        }
        res.status(200).json(tenant);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Create new tenant
exports.create = async (req, res) => {
    const {
        tenantCode,
        residencyCode,
        buildingId
    } = req.body;

    try {
        const tenant = await Tenant.create({
            tenantCode,
            residencyCode,
            buildingId
        });

        res.status(201).json({ message: "Locataire créé avec succès", tenant: tenant });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Update tenant
exports.update = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const tenant = await Tenant.findOne({ where: { id: id } });

        if (tenant != null) {
            // Update only provided fields
            Object.keys(updateData).forEach(key => {
                if (updateData[key] != null && Object.keys(tenant.dataValues).includes(key)) {
                    tenant[key] = updateData[key];
                }
            });

            await tenant.save();
            res.status(200).json({ message: "Locataire modifié avec succès", tenant: tenant });
        } else {
            return res.status(404).json({ message: "Locataire inexistant" });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Delete tenant
exports.delete = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTenant = await Tenant.destroy({ where: { id: id } });

        if (deletedTenant > 0) {
            res.status(200).json({ message: "Locataire supprimé avec succès" });
        } else {
            res.status(404).json({ message: "Locataire inexistant" });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
