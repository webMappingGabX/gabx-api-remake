const JWTService = require('../services/jwtService');

const isExpert = (req, res, next) => {
  try {
    // Vérifier le token depuis les headers ou les cookies
    let token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token d\'accès requis' });
    }

    // Vérifier le token d'accès
    const decodedToken = JWTService.verifyAccessToken(token);
    
    if (!decodedToken) {
      return res.status(401).json({ error: 'Token d\'accès invalide ou expiré' });
    }

    if(decodedToken.statut != "ACTIVE") {
        return res.status(401).json({ error: "Le compte qui tente d'envoyer une requete n'est pas encore actif ou a ete banni" });
    }

    if(decodedToken.role === "DEFAULT") {
      return res.status(401).json({ error: "Il vous faut des droits d'experts ou d'administrateur pour continuer" });
    }

    req.user = {
      id: decodedToken.id,
      username: decodedToken.username,
      email: decodedToken.email,
      profession: decodedToken.profession,
      role: decodedToken.role
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Échec de l\'authentification' });
  }
};

module.exports = isExpert;