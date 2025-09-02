const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const plotRoutes = require("./routes/plot");
const housingEstateRoutes = require("./routes/housingEstate");
const db = require("./db");
const sequelize = require("./sequelize");
const cors = require("cors");
const createAdmin = require('./db/createAdmin');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const CleanupService = require('./services/cleanupService');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
  //origin: '*',  // Autoriser toutes les origines
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configure cookies settings
app.use(cookieParser());
app.use(function(req, res, next) {
  res.cookie('cookieName', 'cookieValue', {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true, // Prevents client-side access to the cookie
    secure: process.env.NODE_ENV === 'production', // Only sends cookie over HTTPS in production
    sameSite: 'strict', // Protects against CSRF
    path: '/' // Cookie is available for all paths
  });
  next();
});

app.options('*', cors());

// Start of any route
let routeHead = "/api/v1";

// Routes
app.use(`${routeHead}/auth`, authRoutes);
app.use(`${routeHead}/users`, userRoutes);
app.use(`${routeHead}/plots`, plotRoutes);
app.use(`${routeHead}/housing-estates`, housingEstateRoutes);

// Health check endpoint
app.get(`${routeHead}/health`, (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erreur serveur' });
});

const port = process.env.PORT || 3000;

async function dbConfigurations() {
  // créer la base de donées si elle n'existe pas
  console.log("Synchronisation de la bd...");
  await db.createDb(process.env.DB_NAME || 'selleroo_db');
  //getDriveFile("1RfLnPrPAwiSS_fTLyFBCJXlJsfQPsxMh");

  // Synchroniser les modèles avec la base de données
  //sequelize.sync({ force: true })
  sequelize.sync({ force: false, alter: true })
  .then(async () => {
    console.log("Les tables ont été synchronisées")
    await createAdmin();

    // Démarrer le service de nettoyage automatique
    CleanupService.startAutomaticCleanup();
  })
  .catch((err) => console.log("Erreur : " + err));
}

// Routes
async function startApplication() {
  try {
    await dbConfigurations();

    // Initialiser le serveur HTTP et socket.io
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });


    // Gestion des connexions socket.io
    io.on('connection', (socket) => {
      // Authentification simple par userId (à adapter selon votre logique)
      const userId = socket.handshake.query.userId;
      if (userId) {
        socket.join(`user-${userId}`);
        console.log(`Socket connecté pour user ${userId}`);
      }
      socket.on('disconnect', () => {
        if (userId) {
          console.log(`Socket déconnecté pour user ${userId}`);
        }
      });
    });

    io.on("error", (err) => {
      console.log("ERROR", err);
    });

    // Démarrage du serveur
    server.listen(port, () => {
      console.log(`L'API (et WebSocket) est disponible via localhost:${port}`);
    });

  } catch (err) {
    console.error('Erreur lors du démarrage de l\'application : ' + err);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
    console.log('\nArrêt de l\'application (SIGTERM)...');
    try {
        await sequelize.close();
        console.log('Application arrêtée proprement');
        process.exit(0);
    } catch (error) {
        console.error('Erreur lors de l\'arrêt:', error);
        process.exit(1);
    }
});

startApplication().then(() => { console.log("APPLICATION START SUCCESSFULLY"); }).catch((err) => { console.log("ERROR", err) });