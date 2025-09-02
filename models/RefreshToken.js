const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const RefreshToken = sequelize.define("refreshToken", {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    jti: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    isRevoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userAgent: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = RefreshToken; 