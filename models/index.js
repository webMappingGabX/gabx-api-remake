const sequelize = require("../sequelize");
const Plot = require("./Plot");
const HousingEstate = require("./HousingEstate");
const User = require("./User");
const RefreshToken = require("./RefreshToken");

Plot.belongsTo(HousingEstate, { foreignKey: { name: 'housingEstateId', allowNull: true }, onDelete: "CASCADE" });
HousingEstate.hasMany(Plot, { foreignKey: { name: 'housingEstateId', allowNull: true }, onDelete: "CASCADE" });

RefreshToken.belongsTo(User, { foreignKey: 'userId', onDelete: "CASCADE" });
User.hasMany(RefreshToken, { foreignKey: 'userId', onDelete: "CASCADE" });

module.exports = {
    User,
    HousingEstate,
    Plot,
    RefreshToken,
    sequelize
};