const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { RefreshToken } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

class JWTService {
    // Générer un token d'accès
    static generateAccessToken(user) {
        return jwt.sign(
            { 
                id: user.id, 
                username: user.username, 
                email: user.email, 
                role: user.role,
                status: user.status
            },
            JWT_SECRET,
            { expiresIn: '1h' } // Token d'accès expire en 1 heure
        );
    }

    // Générer un refresh token avec JTI
    static generateRefreshToken(userId) {
        const jti = uuidv4(); // Génération du JTI unique
        
        const payload = {
            sub: userId,
            jti: jti,
            type: 'refresh'
        };

        const token = jwt.sign(payload, REFRESH_SECRET, {
            expiresIn: '7d',
            issuer: 'api.reddress.io'
        });

        return { token, jti };
    }

    // Créer et sauvegarder un token de rafraîchissement
    static async createRefreshToken(userId, ipAddress, userAgent) {
        const { token, jti } = this.generateRefreshToken(userId);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours

        const refreshToken = await RefreshToken.create({
            token,
            jti,
            userId,
            expiresAt,
            ipAddress,
            userAgent
        });

        return refreshToken;
    }

    // Valider un token de rafraîchissement
    static async validateRefreshToken(token) {
        const refreshToken = await RefreshToken.findOne({
            where: {
                token,
                isRevoked: false,
                expiresAt: {
                    [require('sequelize').Op.gt]: new Date()
                }
            },
            include: ['user']
        });

        return refreshToken;
    }

    // Valider un refresh token via JWT et JTI
    static async validateJWTRefreshToken(token) {
        try {
            // Vérifier la signature JWT
            const decoded = jwt.verify(token, REFRESH_SECRET);

            // Vérifier le JTI dans la base de données
            const refreshToken = await RefreshToken.findOne({
                where: {
                    jti: decoded.jti,
                    isRevoked: false,
                    expiresAt: {
                        [require('sequelize').Op.gt]: new Date()
                    }
                }
            });

            return refreshToken ? decoded : null;
        } catch (error) {
            return null;
        }
    }

    // Extraire le JTI d'un token (sans le vérifier)
    static extractJti(token) {
        try {
            const decoded = jwt.decode(token);
            return decoded?.jti;
        } catch (error) {
            return null;
        }
    }

    // Révoquer un token de rafraîchissement par son token
    static async revokeRefreshToken(token) {
        await RefreshToken.update(
            { isRevoked: true },
            { where: { token } }
        );
    }

    // Révoquer un token de rafraîchissement par son JTI
    static async revokeRefreshTokenByJti(jti) {
        await RefreshToken.update(
            { isRevoked: true },
            { where: { jti } }
        );
    }

    // Révoquer tous les tokens d'un utilisateur
    static async revokeAllUserTokens(userId) {
        await RefreshToken.update(
            { isRevoked: true },
            { where: { userId } }
        );
    }

    // Nettoyer les tokens expirés
    static async cleanupExpiredTokens() {
        await RefreshToken.destroy({
            where: {
                expiresAt: {
                    [require('sequelize').Op.lt]: new Date()
                }
            }
        });
    }

    // Vérifier si un token d'accès est valide
    static verifyAccessToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return null;
        }
    }

    // Vérifier si un refresh token JWT est valide (sans vérification en base)
    static verifyRefreshToken(token) {
        try {
            return jwt.verify(token, REFRESH_SECRET);
        } catch (error) {
            return null;
        }
    }

    // Récupérer tous les tokens actifs d'un utilisateur
    static async getUserActiveTokens(userId) {
        return await RefreshToken.findAll({
            where: {
                userId,
                isRevoked: false,
                expiresAt: {
                    [require('sequelize').Op.gt]: new Date()
                }
            },
            order: [['createdAt', 'DESC']]
        });
    }
}

module.exports = JWTService;