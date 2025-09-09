const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const bcrypt = require("bcrypt");

const User = sequelize.define("user", {
    username: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate : {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM("DEFAULT", "EXPERT", "ADMIN"),
        defaultValue: "DEFAULT",
        allowNull: false
    },
    profession: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetCode : {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetCodeExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE", "SUSPEND"),
        // defaultValue: "INACTIVE",
        defaultValue: "ACTIVE",
        allowNull: false
    }
},
{
    hooks: {
        beforeCreate: async (user) => {
            if(user.password)
            {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if(user.password)
            {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    },
    timestamps: true,
    /*paranoid: true,
    deletedAt: true*/
});

// Méthode pour valider le mot de passe
User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Champs de recherche
User.searchableFields = ["username", "email", "profession", "role", "status"];

module.exports = User;