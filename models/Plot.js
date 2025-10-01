const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Plot = sequelize.define("plot", {
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    geom: {
        //type: DataTypes.GEOGRAPHY('POLYGON', 4326),
        type: DataTypes.GEOGRAPHY('GEOMETRYCOLLECTION', 4326),
        allowNull: true
    },
    /*region: {
        type: DataTypes.STRING,
        allowNull: true
    },
    town: {
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
    },*/
    place: { //lieuDit
        type: DataTypes.STRING,
        allowNull: true
    },
    TFnumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    acquiredYear: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    classification: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    area: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    marketValue: { // valeur venale
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    observations: { // valeur venale
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: { // valeur venale
        type: DataTypes.ENUM("BATI", "NON BATI"),
        allowNull: true
    }
},
{
    timestamps: true,
    indexes: [
        {
            fields: ['geom'],
            using: 'GIST'
        }
    ]
});

// Champs de recherche
//Plot.searchableFields = ["code", "regionId", "departmentId", "arrondissementId", "townId", "housingEstateId", "place", "TFnumber", "acquiredYear", "classification", "status"];
//Plot.searchableFields = ["code", "place", "TFnumber", "status"];
Plot.searchableFields = ["code", "place", "TFnumber", "acquiredYear", "status"];

module.exports = Plot;