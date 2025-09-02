const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    //const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

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

    req.user = { id: decodedToken.id, username: decodedToken.username, email: decodedToken.email, role: decodedToken.role, profession: decodedToken.profession };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Echec de l\'authentification' });
  }
};

module.exports = isAuth;