const sequelize = require("../sequelize");
const Plot = require("./Plot");
const HousingEstate = require("./HousingEstate");
const User = require("./User");
const RefreshToken = require("./RefreshToken");
const Overlap = require("./Overlap");
const Building = require("./Building");
const Tenant = require("./Tenant");
const Observation = require("./Observation");
const Department = require("./Department");
const Region = require("./Regions");
const Arrondissement = require("./Arrondissement");
const Town = require("./Town");

Plot.belongsTo(HousingEstate, { foreignKey: { name: 'housingEstateId', allowNull: true }, onDelete: "CASCADE" });
HousingEstate.hasMany(Plot, { foreignKey: { name: 'housingEstateId', allowNull: true }, onDelete: "CASCADE" });

Plot.belongsToMany(Overlap, { through: 'PlotOverlap', foreignKey: 'plotId', onDelete: "CASCADE" });
Overlap.belongsToMany(Plot, { through: 'PlotOverlap', foreignKey: 'overlapId', onDelete: "CASCADE" });

Building.belongsTo(Plot, { foreignKey: { name: 'plotId', allowNull: true }, onDelete: "CASCADE" });
Plot.hasMany(Building, { foreignKey: { name: 'plotId', allowNull: true }, onDelete: "CASCADE" });

Observation.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(Observation, { foreignKey: "userId", onDelete: "CASCADE" });

Tenant.belongsTo(Building, { foreignKey: { name: 'buildingId', allowNull: true }, onDelete: "CASCADE" });
Building.hasMany(Tenant, { foreignKey: { name: 'buildingId', allowNull: true }, onDelete: "CASCADE" });

RefreshToken.belongsTo(User, { foreignKey: 'userId', onDelete: "CASCADE" });
User.hasMany(RefreshToken, { foreignKey: 'userId', onDelete: "CASCADE" });

// Geo relations
Department.belongsTo(Region, { foreignKey: "regionId", onDelete: "CASCADE" });
Region.hasMany(Department, { foreignKey: "regionId", onDelete: "CASCADE" });

Arrondissement.belongsTo(Department, { foreignKey: "departmentId", onDelete: "CASCADE" });
Department.hasMany(Arrondissement, { foreignKey: "departmentId", onDelete: "CASCADE" });

Town.belongsTo(Arrondissement, { foreignKey: { name: "arrondissementId", allowNull: true }, onDelete: "CASCADE" });
Arrondissement.hasMany(Town, { foreignKey: { name: "arrondissementId", allowNull: true }, onDelete: "CASCADE" });

module.exports = {
    User,
    HousingEstate,
    Plot,
    RefreshToken,
    Building,
    Observation,
    Overlap,
    Tenant,
    Region,
    Department,
    Arrondissement,
    Town,
    sequelize
};