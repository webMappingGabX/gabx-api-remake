const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Department = sequelize.define("department", {
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
Department.searchableFields = ["name"];

module.exports = Department;