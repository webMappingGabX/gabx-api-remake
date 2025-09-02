const multer = require("multer");

// Définir le stockage des fichiers
/*const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Dossier où seront stockés les fichiers
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});*/

const upload = multer({ storage: multer.memoryStorage() });

module.exports = upload;
