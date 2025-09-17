const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Arrondissement = sequelize.define("arrondissement", {
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
Arrondissement.searchableFields = ["name"];

module.exports = Arrondissement;