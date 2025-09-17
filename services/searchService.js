const { Op } = require('sequelize');

class SearchService {
    /**
     * Construit une requête de recherche pour Sequelize
     * @param {string} searchTerm - Terme de recherche
     * @param {Array} searchFields - Champs dans lesquels chercher
     * @returns {Object} Condition WHERE pour Sequelize
     */
    static buildSearchCondition(searchTerm, searchFields, model) {
        if (!searchTerm || !searchFields || searchFields.length === 0) {
            return {};
        }
    
        const conditions = searchFields.map(field => {
            const fieldType = model.rawAttributes[field]?.type?.key || '';
            
            if (fieldType === 'INTEGER' || fieldType === 'BIGINT' || fieldType === 'FLOAT' || fieldType === 'DECIMAL') {
                // Pour les champs numériques
                const numericValue = parseInt(searchTerm);
                if (!isNaN(numericValue)) {
                    return { [field]: numericValue };
                }
                return null;
            } else {
                // Pour les champs texte
                return {
                    [field]: {
                        [Op.iLike]: `%${searchTerm}%`
                    }
                };
            }
        }).filter(condition => condition !== null);
    
        if (conditions.length === 0) {
            return {};
        }
    
        return { [Op.or]: conditions };
    }

    /**
     * Recherche paginée avec filtres
     * @param {Model} model - Modèle Sequelize
     * @param {Object} options - Options de recherche
     * @returns {Promise<Object>} Résultats et métadonnées l'opérateur n'existe pas : integer ~~* unknown
     */
    static async search(model, options = {}) {
        const {
            searchTerm,
            searchFields = model.searchableFields || [],
            where = {},
            include = [],
            order = [['createdAt', 'DESC']],
            page = 1,
            limit = 10,
            paranoid = true
        } = options;

        // Construction de la condition de recherche
        const searchCondition = this.buildSearchCondition(searchTerm, searchFields, model);

        /* console.log("HTHTHTHT   ", searchCondition)
        console.log("TESTESTE", [
            searchCondition,
            where
        ]); */

        // Condition WHERE finale
        const finalWhere = {
            [Op.and]: [
                searchCondition,
                where
            ].filter(condition => Object.getOwnPropertySymbols(condition).length > 0 || Object.keys(condition).length > 0)
        };

        //console.log("HTHTHTHT  FW ", finalWhere)
        // Pagination
        const offset = (page - 1) * limit; Symbol

        const { count, rows } = await model.findAndCountAll({
            where: finalWhere,
            include,
            order,
            limit,
            offset,
            paranoid,
            distinct: true // Important pour les includes avec jointures
        });

        return {
            data: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit),
                hasNext: page < Math.ceil(count / limit),
                hasPrev: page > 1
            }
        };
    }

    /**
     * Filtrage avancé avec opérateurs
     * @param {Object} query - Query parameters
     * @param {Array} allowedFilters - Champs filtrables
     * @returns {Object} Conditions WHERE
     */
    static buildFilterConditions(query, allowedFilters = []) {
        const where = {};
        const { Op } = require('sequelize');

        for (const [key, value] of Object.entries(query)) {
            if (allowedFilters.includes(key) && value) {
                // Gestion des opérateurs spéciaux
                if (value.startsWith('>=')) {
                    where[key] = { [Op.gte]: value.slice(2) };
                } else if (value.startsWith('<=')) {
                    where[key] = { [Op.lte]: value.slice(2) };
                } else if (value.startsWith('>')) {
                    where[key] = { [Op.gt]: value.slice(1) };
                } else if (value.startsWith('<')) {
                    where[key] = { [Op.lt]: value.slice(1) };
                } else if (value.includes(',')) {
                    // Valeurs multiples (IN)
                    where[key] = { [Op.in]: value.split(',') };
                } else {
                    // Recherche exacte
                    where[key] = value;
                }
            }
        }

        return where;
    }
}

module.exports = SearchService;