const { User } = require("../models");
const { Observation } = require("../models");
const { Plot } = require("../models");
const { Building } = require("../models");
const { HousingEstate } = require("../models");

// Helper to format activity
function formatActivity({ type, user, createdAt, extra }) {
    return {
        type,
        user: user ? {
            id: user.id,
            username: user.username,
            email: user.email
        } : null,
        createdAt,
        ...extra
    };
}

// Get 10 most recent platform activities (user register, observation created, plot created, building created, housing estate created)
exports.recent = async (req, res) => {
    try {
        // Fetch recent users
        const users = await User.findAll({
            order: [['createdAt', 'DESC']],
            limit: 10,
            attributes: ['id', 'username', 'email', 'createdAt']
        });

        // Fetch recent observations
        const observations = await Observation.findAll({
            order: [['createdAt', 'DESC']],
            limit: 10,
            attributes: ['id', 'userId', 'createdAt', 'category'],
            include: [{
                model: User,
                attributes: ['id', 'username', 'email']
            }]
        });

        // Fetch recent plots
        const plots = await Plot.findAll({
            order: [['createdAt', 'DESC']],
            limit: 10,
            attributes: ['id', 'createdAt', 'code']
        });

        // Fetch recent buildings
        const buildings = await Building.findAll({
            order: [['createdAt', 'DESC']],
            limit: 10,
            attributes: ['id', 'createdAt', 'code']
        });

        // Fetch recent housing estates
        const housingEstates = await HousingEstate.findAll({
            order: [['createdAt', 'DESC']],
            limit: 10,
            attributes: ['id', 'createdAt', 'name']
        });

        // Map and merge all activities
        const activities = [
            ...users.map(u => formatActivity({
                type: "user_register",
                user: u,
                createdAt: u.createdAt,
                extra: {}
            })),
            ...observations.map(o => formatActivity({
                type: "observation_created",
                user: o.user,
                createdAt: o.createdAt,
                extra: { observationId: o.id, category: o.category }
            })),
            ...plots.map(p => formatActivity({
                type: "plot_created",
                user: p.user,
                createdAt: p.createdAt,
                extra: { plotId: p.id, code: p.code }
            })),
            ...buildings.map(b => formatActivity({
                type: "building_created",
                user: b.User,
                createdAt: b.createdAt,
                extra: { buildingId: b.id, code: b.code }
            })),
            ...housingEstates.map(h => formatActivity({
                type: "housing_estate_created",
                user: h.user,
                createdAt: h.createdAt,
                extra: { housingEstateId: h.id, name: h.name }
            }))
        ];

        // Sort all by createdAt descending and take the 10 most recent
        activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const recentActivities = activities.slice(0, 10);

        res.status(200).json(recentActivities);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
