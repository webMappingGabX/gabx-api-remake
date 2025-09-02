const JWTService = require('./jwtService');

class CleanupService {
    static async cleanupExpiredTokens() {
        try {
            await JWTService.cleanupExpiredTokens();
            console.log('Nettoyage des tokens expirés terminé');
        } catch (error) {
            console.error('Erreur lors du nettoyage des tokens:', error);
        }
    }

    // Fonction pour démarrer le nettoyage automatique
    static startAutomaticCleanup() {
        // Nettoyer toutes les heures
        setInterval(async () => {
            await this.cleanupExpiredTokens();
        }, 60 * 60 * 1000); // 1 heure

        // Nettoyer au démarrage
        this.cleanupExpiredTokens();
    }
}

module.exports = CleanupService; 