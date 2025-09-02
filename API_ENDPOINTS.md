# API Endpoints Documentation

## Base URL
`/api/v1`

## Authentication
All endpoints (except auth) require authentication via JWT token in the Authorization header.

## Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - User logout

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `DELETE /users/delete-account` - Delete current user account
- `PUT /users/update-account` - Update current user profile
- `PUT /users/change-password` - Change user password
- `PUT /users/:id/set-inactive` - Set user as inactive
- `PUT /users/:id/set-active` - Set user as active
- `PUT /users/:id/set-banned` - Ban user

### Plots
- `GET /plots` - Get all plots with housing estate info
- `GET /plots/:code` - Get plot by code
- `POST /plots` - Create new plot
- `PUT /plots/:code` - Update plot
- `DELETE /plots/:code` - Delete plot
- `GET /plots/housing-estate/:housingEstateId` - Get plots by housing estate
- `GET /plots/region/:region` - Get plots by region
- `GET /plots/status/:status` - Get plots by status (BATI/NON BATI)

### Housing Estates
- `GET /housing-estates` - Get all housing estates with plot info
- `GET /housing-estates/:id` - Get housing estate by ID
- `POST /housing-estates` - Create new housing estate
- `PUT /housing-estates/:id` - Update housing estate
- `DELETE /housing-estates/:id` - Delete housing estate (only if no plots)
- `GET /housing-estates/:id/stats` - Get housing estate statistics
- `GET /housing-estates/region/:region` - Get housing estates by region

### Health Check
- `GET /health` - API health status

## Data Models

### Plot
- `code` (String) - Plot identifier
- `geom` (Geography) - Plot geometry (multipolygon)
- `region` (String) - Region name
- `department` (String) - Department name
- `city` (String) - City name
- `lieuDit` (String) - Place name
- `TFnumber` (String) - TF number
- `acquiredYear` (Integer) - Year acquired
- `classification` (Integer) - Classification
- `area` (Decimal) - Plot area
- `price` (Decimal) - Purchase price
- `marketValue` (Decimal) - Market value
- `observations` (Text) - Additional notes
- `status` (Enum: "BATI", "NON BATI") - Build status
- `housingEstateId` (Integer, Foreign Key) - Reference to housing estate

### Housing Estate
- `id` (Integer, Primary Key, Auto-increment) - Unique identifier
- `name` (String) - Housing estate name

## Relationships
- Plot belongs to HousingEstate
- HousingEstate has many Plots
- User has many RefreshTokens
