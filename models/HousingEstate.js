const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const HousingEstate = sequelize.define("housingEstate", {
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    region: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true
    },
    district: {
        type: DataTypes.STRING,
        allowNull: true
    },
    place: { //lieuDit
        type: DataTypes.STRING,
        allowNull: true
    },
    buildingsType: {
        type: DataTypes.ENUM("COLLECTIVE", "INDIVIDUAL"),
        allowNull: true
    },
    category: {
        type: DataTypes.STRING, // BATIMENT SIC
        allowNull: true
    }
},
{
    timestamps: true
});

// Champs de recherche
HousingEstate.searchableFields = ["name", "region", "city", "department", "district", "place", "buildingsType", "category"];

module.exports = HousingEstate;