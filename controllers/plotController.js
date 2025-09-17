const { Plot, HousingEstate } = require('../models');
const SearchService = require('../services/searchService');

// Get all plots
exports.all = async (req, res) => {
    try {
        const {
            search,
            page = 1,
            limit = 100,
            region,
            city,
            departement,
            district,
            place,
            status,
            sortBy = "code",
            sortOrder = "ASC"
        } = req.query;

        // search
        //console.log("TEXT TO SEARCH     ", search);
        // filtres exacts
        const where = {};
        if(region) where.region = region;
        if(city) where.city = city;
        if(departement) where.departement = departement;
        if(district) where.district = district;
        if(place) where.place = place;
        if(status) where.status = status;
        
        const plots = await SearchService.search(Plot, {
            searchTerm: search,
            page: parseInt(page),
            limit: parseInt(limit),
            where,
            include: [{
                model: HousingEstate,
                required: false
            }],
            order: [[sortBy, sortOrder]]
        });

        /* const plots = await Plot.findAll({
            include: [{
                model: HousingEstate,
                required: false
            }],
            order: [['code', 'ASC']]
        }); */

        res.status(200).json(plots);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Get plot by code
exports.get = async (req, res) => {
    const { code } = req.params;

    try {
        const plot = await Plot.findOne({
            where: { code: code },
            include: [{
                model: HousingEstate,
                required: false
            }]
        });

        if (plot == null) {
            return res.status(404).json("Cette parcelle n'existe pas");
        }
        res.status(200).json(plot);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Create new plot
exports.create = async (req, res) => {
    const {
        code,
        geom,
        region,
        city,
        department,
        district,
        place,
        TFnumber,
        acquiredYear,
        classification,
        area,
        price,
        marketValue,
        observations,
        status,
        housingEstateId = null
    } = req.body;

    try {
        const plot = await Plot.create({
            code,
            geom,
            region,
            city,
            department,
            district,
            place,
            TFnumber,
            acquiredYear,
            classification,
            area,
            price,
            marketValue,
            observations,
            status,
            housingEstateId
        });

        res.status(201).json({ message: "Parcelle créée avec succès", plot: plot });
    } catch (err) {
        console.log("ERROR CREATING PLOT", err);
        res.status(500).json({
            message: err.message
        });
    }
};

// Update plot
exports.update = async (req, res) => {
    const { code } = req.params;
    const updateData = req.body;

    try {
        const plot = await Plot.findOne({ where: { code: code } });

        if (plot != null) {
            // Update only provided fields
            Object.keys(updateData).forEach(key => {
                if (updateData[key] != null && plot.hasOwnProperty(key)) {
                    plot[key] = updateData[key];
                }
            });

            await plot.save();
            res.status(200).json({ message: "Parcelle modifiée avec succès", plot: plot });
        } else {
            return res.status(404).json({ message: "Parcelle inexistante" });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Delete plot
exports.delete = async (req, res) => {
    const { code } = req.params;

    try {
        const deletedPlot = await Plot.destroy({ where: { code: code } });

        if (deletedPlot > 0) {
            res.status(200).json({ message: "Parcelle supprimée avec succès" });
        } else {
            res.status(404).json({ message: "Parcelle inexistante" });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Get plots by housing estate
exports.getByHousingEstate = async (req, res) => {
    const { housingEstateId } = req.params;

    try {
        const plots = await Plot.findAll({
            where: { housingEstateId: housingEstateId },
            order: [['code', 'ASC']]
        });
        res.status(200).json(plots);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Get plots by region
exports.getByRegion = async (req, res) => {
    const { region } = req.params;

    try {
        const plots = await Plot.findAll({
            where: { region: region },
            include: [{
                model: HousingEstate,
                required: false
            }],
            order: [['code', 'ASC']]
        });
        res.status(200).json(plots);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Get plots by status
exports.getByStatus = async (req, res) => {
    const { status } = req.params;

    try {
        const plots = await Plot.findAll({
            where: { status: status },
            include: [{
                model: HousingEstate,
                required: false
            }],
            order: [['code', 'ASC']]
        });
        res.status(200).json(plots);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
