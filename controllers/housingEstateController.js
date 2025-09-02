const { HousingEstate, Plot } = require('../models');
const SearchService = require('../services/searchService');

// Get all housing estates
exports.all = async (req, res) => {

    try {
        const {
            search,
            page = 1,
            limit = 10,
            region,
            city,
            departement,
            district,
            place,
            statut,
            buildingsType,
            sortBy = "code",
            sortOrder = "ASC"
        } = req.query;

        // filtres exacts
        const where = {};
        if(region) where.region = region;
        if(city) where.city = city;
        if(departement) where.departement = departement;
        if(district) where.district = district;
        if(place) where.place = place;
        if(statut) where.statut = statut;
        if(buildingsType) where.buildingsType = buildingsType;
        
        const housingEstates = await SearchService.search(HousingEstate, {
            searchTerm: search,
            page: parseInt(page),
            limit: parseInt(limit),
            where,
            include: [{
                model: Plot
            }],
            order: [[sortBy, sortOrder]]
        });

        /*const housingEstates = await HousingEstate.findAll({
            include: [{
                model: Plot,
                attributes: ['code', 'area', 'status']
            }],
            order: [['name', 'ASC']]
        });*/

        res.status(200).json(housingEstates);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Get housing estate by id
exports.get = async (req, res) => {
    const { id } = req.params;

    try {
        const housingEstate = await HousingEstate.findOne({
            where: { id: id },
            include: [{
                model: Plot
            }]
        });

        if (housingEstate == null) {
            return res.status(404).json("Cette Cité n'existe pas");
        }
        res.status(200).json(housingEstate);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Create new housing estate
exports.create = async (req, res) => {
    const { name } = req.body;

    try {
        const housingEstate = await HousingEstate.create({
            name
        });

        res.status(201).json({ message: "Cité créée avec succès", housingEstate: housingEstate });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Update housing estate
exports.update = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const housingEstate = await HousingEstate.findOne({ where: { id: id } });

        if (housingEstate != null) {
            if (name != null) housingEstate.name = name;

            await housingEstate.save();
            res.status(200).json({ message: "Cité modifiée avec succès", housingEstate: housingEstate });
        } else {
            return res.status(404).json({ message: "Cité inexistante" });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Delete housing estate
exports.delete = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if housing estate has plots
        const plotCount = await Plot.count({ where: { housingEstateId: id } });
        
        if (plotCount > 0) {
            return res.status(400).json({ 
                message: "Impossible de supprimer cette Cité car elle contient des parcelles" 
            });
        }

        const deletedHousingEstate = await HousingEstate.destroy({ where: { id: id } });

        if (deletedHousingEstate > 0) {
            res.status(200).json({ message: "Cité supprimée avec succès" });
        } else {
            res.status(404).json({ message: "Cité inexistante" });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Get housing estate statistics
exports.getStats = async (req, res) => {
    const { id } = req.params;

    try {
        const housingEstate = await HousingEstate.findByPk(id);
        
        if (!housingEstate) {
            return res.status(404).json({ message: "Cité inexistante" });
        }

        const plots = await Plot.findAll({ where: { housingEstateId: id } });
        
        const stats = {
            totalPlots: plots.length,
            totalArea: plots.reduce((sum, plot) => sum + (parseFloat(plot.area) || 0), 0),
            builtPlots: plots.filter(plot => plot.status === 'BATI').length,
            unbuiltPlots: plots.filter(plot => plot.status === 'NON BATI').length,
            totalValue: plots.reduce((sum, plot) => sum + (parseFloat(plot.marketValue) || 0), 0),
            regions: [...new Set(plots.map(plot => plot.region).filter(Boolean))],
            departments: [...new Set(plots.map(plot => plot.department).filter(Boolean))]
        };

        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Get housing estates by region
exports.getByRegion = async (req, res) => {
    const { region } = req.params;

    try {
        const housingEstates = await HousingEstate.findAll({
            include: [{
                model: Plot,
                where: { region: region }
            }],
            order: [['name', 'ASC']]
        });
        res.status(200).json(housingEstates);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
