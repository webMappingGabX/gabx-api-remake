const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Op } = require('sequelize');
const JWTService = require('../services/jwtService');
const nodemailer = require('nodemailer');

exports.register = async (req, res) => {
  try {
    const { username, email, profession, password } = req.body;

    const newUser = await User.create({ username, email, profession, password });

    return res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        "id": newUser.id,
        "name": newUser.name,
        "email": newUser.email,
        "role": newUser.role,
        "profession": newUser.profession
      }
    });
  } catch (err) {
    return res.status(400).json({
      message: "Impossible de créé l'utilisateur",
      error: err
    });
  }
}


exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({ 
      where: { 
        [Op.or]: [
          { email: identifier },
          { username: identifier }
        ]
      },
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const isPasswordValid = await user.validPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Génère un token JWT avec l'ID de l'utilisateur
    const accessToken = JWTService.generateAccessToken(user);
    const refreshToken = await JWTService.createRefreshToken(
      user.id, 
      req.ip, 
      req.get('User-Agent')
  );

    
    /*res.cookie("token", accessToken, {
      maxAge: 15 * 24 * 3600,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'Strict'
    });*/
    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 3600,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'Strict'
    });

    res.status(200).json({ message: 'Connexion réussie', user, "access": accessToken, "refresh": refreshToken.token });
  } catch (err) {
    res.status(400).json({ message: "Une erreur s'est produite pendant la connexion", error: err.message });
  }
}

exports.logout = async (req, res) => {
  try {
      // Try to get refresh token from cookie first, then from body if not present
      let refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        refreshToken = req.body?.refreshToken;
      }

      if (refreshToken) {
          // Extraire le JTI pour révoquer le token
          const jti = JWTService.extractJti(refreshToken);
          if (jti) {
              await JWTService.revokeRefreshTokenByJti(jti);
          }
      }
      
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'Strict'
      });

      res.json({ message: 'Déconnexion réussie' });
  } catch (error) {
      res.status(500).json({ error: 'Erreur de déconnexion' });
  }
}


exports.refreshToken =  async (req, res) => {
  try {
      let refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        refreshToken = req.body?.refreshToken;
      }
      
      if(!refreshToken) {
        return res.status(401).json({ error: 'Refresh token introuvable' });
      }

      // Validation du refresh token
      const validToken = await JWTService.validateJWTRefreshToken(refreshToken);
      
      if (!validToken) {
          return res.status(401).json({ error: 'Refresh token invalide' });
      }

      // Récupération de l'utilisateur
      const user = await User.findByPk(validToken.sub);
      
      if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé' });
      }

      // Révoquer l'ancien token
      await JWTService.revokeRefreshTokenByJti(validToken.jti);

      // Générer nouveaux tokens
      const newAccessToken = JWTService.generateAccessToken(user);
      const newRefreshToken = await JWTService.createRefreshToken(
          user.id,
          req.ip,
          req.get('User-Agent')
      );

      res.cookie("refreshToken", newRefreshToken.token, {
        maxAge: 7 * 24 * 3600,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'Strict'
      });

      res.json({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken.token,
          expiresIn: 3600
      });
  } catch (error) {
      res.status(401).json({ error: 'Token de rafraîchissement invalide' });
  }
}

// Configuration Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
  }
});

// Fonction pour générer un code à 6 chiffres
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Route pour envoyer le code de réinitialisation
exports.sendResetCode = async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
      return res.status(400).json({ error: 'Email requis' });
  }

  try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
          return res.status(404).json({ error: "Cet email n'est associé à aucun compte" });
      }

      const code = generateCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Update user with new reset code
      user.resetCode = code;
      user.resetCodeExpiresAt = expiresAt;
      await user.save();

      // Envoyer l'email
      const mailOptions = {
          from: `"${process.env.FROM_EMAIL_NAME}" <${process.env.FROM_EMAIL_ADDRESS}>`,
          to: email,
          subject: 'Réinitialisation de votre mot de passe',
          text: `Votre code de réinitialisation est : ${code}\nCe code expirera dans 15 minutes.`,
          html: `
              <p>Votre code de réinitialisation est :
                <strong>${code}</strong></p>
              <p>Ce code expirera dans 15 minutes.</p>
          `
      };

      await transporter.sendMail(mailOptions);
      
      return res.json({ 
          success: true,
          message: 'Code envoyé avec succès'
      });
  } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({ error: 'Erreur lors de l\'envoi du code' });
  }
}

// Route pour verifier le code envoye par mail
exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;
  
  if (!email || !code ) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
          return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      // Check if code is valid and not expired
      if (!user.resetCode || user.resetCode !== code || new Date() > user.resetCodeExpiresAt) {
          return res.status(400).json({ error: 'Code invalide ou expiré' });
      }

      res.json({ 
          success: true,
          message: 'Le code correspond bien a celui attendu'
      });
  } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({ error: 'Erreur lors de la verification' });
  }
}

// Route pour réinitialiser le mot de passe
exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  
  if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
          return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      // Check if code is valid and not expired
      if (!user.resetCode || user.resetCode !== code/* || new Date() > user.resetCodeExpiresAt*/) {
          return res.status(400).json({ error: 'Code invalide ou expiré' });
      }

      // Update password and clear reset code fields
      user.password = newPassword;
      user.resetCode = null;
      user.resetCodeExpiresAt = null;
      await user.save();

      // Révoquer tous les tokens de l'utilisateur pour forcer une nouvelle connexion
      await JWTService.revokeAllUserTokens(user.id);

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'Strict'
      });

      res.json({ 
          success: true,
          message: 'Mot de passe réinitialisé avec succès'
      });
  } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({ error: 'Erreur lors de la réinitialisation' });
  }
}