# WebMappingAPI

# Application NodeJS

## Description
Cette application node.js et express.js permet l'authentification des utilisateurs avec un système d'inscription et de connexion sécurisé. Elle utilise **Postgresql** comme sgbd et **sequelize** pour la gestion des modèles.


## 📋 Prérequis

- Node.js (version 22.12.0+)
- npm (version 10.9.0)
- postgresql (version 14+) + postgis

## 🛠️ Installation

### Clonage du Projet

```bash
git clone https://github.com/webMappingGabX/gabx-api-remake.git
cd gabx-api-remake
```

### Installation des Dépendances

```bash
npm install
```

## 🔧 Configuration

1. Créez un fichier `.env` à la racine du projet
2. Ajoutez les variables d'environnement suivantes :

```
JWT_SECRET=my_jwt_secret_237
REFRESH_SECRET=my_refresh_secret_237

# Configuration de la base de données
DB_HOST=localhost
DB_USER=postgres
DB_NAME=gabx
DB_PASSWORD=postgres
DB_PORT=5432

DEFAULT_DB_NAME=postgres

# Configuration du serveur
PORT=5000

# Autres variables d'environnement si nécessaire
NODE_ENV=development
DB_SSL=false

ADMIN_USERNAME=admin
ADMIN_EMAIL=handsome.nearby@gmail.com
ADMIN_PASSWORD=1234567a

DEFAULT_USER_PASSWORD=12345678

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=handsome.nearby@gmail.com
SMTP_PASS=my_smtp_pass
FROM_EMAIL_NAME=GabX
FROM_EMAIL_ADDRESS=handsome.nearby@gmail.com

```

## 🚦 Démarrage de l'Application

### Développement

```bash
npm run dev
```

### Production

```bash
npm start
```

## 📡 Points de Terminaison API

### Authentification

- `POST /api/v1/auth/register` - Inscription
- `POST /api/v1/auth/login` - Connexion
- `POST /api/v1/auth/logout` - Déconnexion
- `POST /api/v1/auth/refresh` - Rafraichir le token d'acces
- `POST /api/v1/auth/send-reset-code` - Envoyer le code de reinitialisation du mot de passe
- `POST /api/v1/auth/verify-code` - Verifier le code envoye par email
- `POST /api/v1/auth/reset-password` - Renseigner le nouveau mot de passe

### Cites

- `GET /api/v1/housing-estates` - Recuperer toutes les cites
- `GET /api/v1/housing-estates?search=searchTerm&page=1&limit=10&sortBy=name&sortOrder=ASC` - Logique de recherche des cites
- `GET /api/v1/housing-estates?region=region` - Recuperer les cites d'une region specifique
- `GET /api/v1/housing-estates/:id` - Recupere une cite specifique a partir de son id
- `POST /api/v1/housing-estates` - Creer une cite
- `PATCH /api/v1/housing-estates/:id` - Modifier une cite existante
- `DELETE /api/v1/housing-estates/:id` - Supprimer une cite
- `GET /api/v1/housing-estate/:id/stats` - Stats des cites

### Parcelles

- `GET /api/v1/plots` - Recuperer toutes les parcelles
- `GET /api/v1/plots?search=searchTerm&page=1&limit=10&sortBy=name&sortOrder=ASC` - Logique de recherche des parcelles
- `GET /api/v1/plots?region=region` - Recuperer les parcelles d'une region specifique
- `GET /api/v1/plots/:id` - Recupere une parcelle specifique a partir de son id
- `POST /api/v1/plots` - Creer une parcelle
- `PATCH /api/v1/plots/:id` - Modifier une parcelle existante
- `DELETE /api/v1/plots/:id` - Supprimer une parcelle
- `GET /api/v1/housing-estate/:id/stats` - Stats des parcelles

### Utilisateurs

- `GET /api/v1/users` - Recuperer toutes les utilisateurs (Admin)
- `GET /api/v1/users?search=searchTerm&page=1&limit=10&sortBy=name&sortOrder=ASC` - Logique de recherche des utilisateurs (Admin)
- `GET /api/v1/users?role=EXPERT` - Recuperer les experts de la plateforme (Admin) 
- `GET /api/v1/users/:id` - Recupere un utilisateur specifique a partir de son id (Admin)
- `GET /api/v1/users/me` - L'utilisateur actif peut recuperer les infos de son compte
- `POST /api/v1/users` - Creer un utilisateur
- `PATCH /api/v1/users/:id` - Modifier un utilisateur existant (Admin)
- `PATCH /api/v1/users/update-account` - L'utilisateur actif peut modifier son compte
- `PATCH /api/v1/users/change-password` - L'utilisateur actif peut changer son mot de passe
- `DELETE /api/v1/users/:id` - Supprimer un utilisateur (Admin)
- `DELETE /api/v1/users/delete-account` - L'utilisateur actif peut supprimer son compte

## 🧪 Tests

```bash
npm test
```

## 🔒 Sécurité

- Authentification par JWT
- Validation des entrées
- Protection contre les attaques CSRF et XSS

## 📦 Dépendances Principales

- Express.js
- bcrypt
- jsonwebtoken
- dotenv
- cors
- multer
- nodemailer

## 📝 Structure du Projet

```
app/
│
├── controllers/
├── db/
├── middleware/
├── models/
├── routes/
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 🤝 Contribution

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commitez vos modifications (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📜 Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

## 📞 Contact

Mac Dallas - [roylexstephane@gmail.com]

Lien du Projet: [https://github.com/webMappingGabX/gabx-api-remake.git](https://github.com/webMappingGabX/gabx-api-remake)