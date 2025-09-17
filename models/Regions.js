const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Region = sequelize.define("region", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
},
{
    timestamps: true,
});

// Champs de recherche
Region.searchableFields = ["name"];

module.exports = Region;