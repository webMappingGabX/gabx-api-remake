const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Overlap = sequelize.define("overlap", {
    geom: {
        //type: DataTypes.GEOGRAPHY('POLYGON', 4326),
        type: DataTypes.GEOGRAPHY('POLYGON', 4326),
        allowNull: true
    },
    area: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: true
    }
},
{
    timestamps: true,
    indexes: [
        {
            fields: ['geom'],
            using: 'GIST'
        }
    ]
});

// Champs de recherche
Overlap.searchableFields = [];

module.exports = Overlap;