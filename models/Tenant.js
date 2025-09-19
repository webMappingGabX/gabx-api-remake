const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Tenant = sequelize.define("tenant", {
    tenantCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    residencyCode: {
        type: DataTypes.STRING,
        allowNull: true
    }
},
{
    timestamps: true,
});

// Champs de recherche
Tenant.searchableFields = ["tenantCode", "residencyCode"];

module.exports = Tenant;