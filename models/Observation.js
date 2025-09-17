const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Observation = sequelize.define("observation", {
    category: {
        type: DataTypes.ENUM("PAINT"),
        allowNull: true
    },
    scale: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        minValue: 0,
        maxValue: 10,
        allowNull: true
    },
    content: {
        type: DataTypes.STRING,
        allowNull: true
    }
},
{
    timestamps: true,
});

// Champs de recherche
Observation.searchableFields = ["category", "scale", "content"];

module.exports = Observation;