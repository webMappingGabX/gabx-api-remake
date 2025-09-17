const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Tenant = sequelize.define("tenant", {
    tenant_code: {
        type: DataTypes.STRING,
        allowNull: true
    },
    residency_code: {
        type: DataTypes.STRING,
        allowNull: true
    }
},
{
    timestamps: true,
});

// Champs de recherche
Tenant.searchableFields = ["tenant_code", "residency_code"];

module.exports = Tenant;