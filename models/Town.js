const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Town = sequelize.define("town", {
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
Town.searchableFields = ["name"];

module.exports = Town;