const SearchService = require("../services/searchService");


function searchMiddleware(model, options = {}) {
    return async (req, res, next) => {
        try {
            const {
                search,
                page = 1,
                limit = 10,
                sortBy = 'createdAt',
                sortOrder = 'DESC',
                ...filters
            } = req.query;

            // Filtres supplémentaires
            const additionalWhere = SearchService.buildFilterConditions(
                filters,
                options.filterableFields || []
            );

            // Conditions WHERE par défaut
            const defaultWhere = options.defaultWhere || {};

            // Recherche
            const result = await SearchService.search(model, {
                searchTerm: search,
                searchFields: options.searchFields || model.searchableFields,
                where: { ...defaultWhere, ...additionalWhere },
                include: options.include || [],
                order: [[sortBy, sortOrder.toUpperCase()]],
                page: parseInt(page),
                limit: parseInt(limit),
                paranoid: options.paraloid !== false
            });

            res.json({
                success: true,
                data: result.data,
                pagination: result.pagination
            });

        } catch (error) {
            next(error);
        }
    };
}

module.exports = searchMiddleware;