const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Building = sequelize.define("building", {
    geom: {
        type: DataTypes.GEOGRAPHY('GEOMETRYCOLLECTION', 4326),
        allowNull: true
    },
    code: {
        type: DataTypes.STRING,
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
Building.searchableFields = ["code"];

module.exports = Building;