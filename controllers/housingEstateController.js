const { HousingEstate, Plot, Region, Department, Arrondissement, Town } = require('../models');
const SearchService = require('../services/searchService');

// Inclusion
const inclusions = [{
    model: Plot,
    required: false
}, {
    model: Region,
    required: false
}, {
    model: Department,
    required: false
}, {
    model: Arrondissement,
    required: false
}, {
    model: Town,
    required: false
}]

// Get all housing estates
exports.all = async (req, res) => {

    try {
        const {
            search,
            page = 1,
            limit = 10,
            regionId,
            departmentId,
            arrondissementId,
            townId,
            place,
            buildingsType,
            sortBy = "code",
            sortOrder = "ASC"
        } = req.query;

        // filtres exacts
        const where = {};
        if(regionId) where.regionId = regionId;
        if(departmentId) where.departmentId = departmentId;
        if(arrondissementId) where.arrondissementId = arrondissementId;
        if(townId) where.townId = townId;
        if(place) where.place = place;
        if(buildingsType) where.buildingsType = buildingsType;
        
        const housingEstates = await SearchService.search(HousingEstate, {
            searchTerm: search,
            page: parseInt(page),
            limit: parseInt(limit),
            where,
            include: inclusions,
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
            include: inclusions
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
    const { name, regionId, departmentId, arrondissementId, townId, place, buildingsType, category } = req.body;

    try {
        const housingEstate = await HousingEstate.create({
            name, regionId, departmentId, arrondissementId, townId, place, buildingsType, category
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
    const { name, regionId, departmentId, arrondissementId, townId, place, buildingsType, category } = req.body;

    try {
        const housingEstate = await HousingEstate.findOne({ where: { id: id } });

        if (housingEstate != null) {
            if (name != null) housingEstate.name = name;
            if (regionId != null) housingEstate.regionId = regionId;
            if (departmentId != null) housingEstate.departmentId = departmentId;
            if (arrondissementId != null) housingEstate.arrondissementId = arrondissementId;
            if (townId != null) housingEstate.townId = townId;
            if (place != null) housingEstate.place = place;
            if (buildingsType != null) housingEstate.buildingsType = buildingsType;
            if (category != null) housingEstate.category = category;

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
            regions: [...new Set(plots.map(plot => plot.regionId).filter(Boolean))],
            departments: [...new Set(plots.map(plot => plot.departmentId).filter(Boolean))]
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
    const { regionId } = req.params;

    try {
        const housingEstates = await HousingEstate.findAll({
            include: [{
                model: Plot,
                where: { regionId: regionId }
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

// Get global statistics about housing estates
exports.stats = async (req, res) => {
    try {
        // Total number of housing estates
        const totalHousingEstates = await HousingEstate.count();

        // Get all plots to compute aggregate stats
        const plots = await Plot.findAll();

        // Compute stats
        const totalPlots = plots.length;
        const totalArea = plots.reduce((sum, plot) => sum + (parseFloat(plot.area) || 0), 0);
        const builtPlots = plots.filter(plot => plot.status === 'BATI').length;
        const unbuiltPlots = plots.filter(plot => plot.status === 'NON BATI').length;
        const totalValue = plots.reduce((sum, plot) => sum + (parseFloat(plot.marketValue) || 0), 0);

        // Unique regions and departments
        const regions = [...new Set(plots.map(plot => plot.regionId).filter(Boolean))];
        const departments = [...new Set(plots.map(plot => plot.departmentId).filter(Boolean))];

        res.status(200).json({
            totalHousingEstates,
            totalPlots,
            totalArea,
            builtPlots,
            unbuiltPlots,
            totalValue,
            regions,
            departments
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

