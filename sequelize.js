const { Sequelize } = require("sequelize");
require('dotenv').config();


const sslOptions = process.env.DB_SSL === 'true' ? {
    ssl: {
        require: true,
        rejectUnauthorized: false,
        // ca: fs.readFileSync(process.env.DB_SSL_CA || '').toString(),
        // key: fs.readFileSync(process.env.DB_SSL_KEY || '').toString(),
        // cert: fs.readFileSync(process.env.DB_SSL_CERT || '').toString()
    }
} : {};

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            // Activer l'extension PostGIS automatiquement
            statement_timeout: 60000,
            idle_in_transaction_session_timeout: 60000,
            ...sslOptions
        },
        hooks: {
            beforeConnect: async (config) => {
                // Activer l'extension PostGIS si elle n'existe pas
                const { Client } = require('pg');
                const client = new Client({
                    host: config.host,
                    port: config.port,
                    database: config.database,
                    user: config.username,
                    password: config.password,
                });
                
                try {
                    await client.connect();
                    await client.query('CREATE EXTENSION IF NOT EXISTS postgis;');
                    await client.end();
                } catch (error) {
                    console.warn('Impossible d\'activer PostGIS:', error.message);
                }
            }
        }
    }
);

sequelize.authenticate()
.then(() => console.log("Connexion à postgresql reussie"))
.catch((err) => console.error("Erreur : " + err));

module.exports = sequelize;