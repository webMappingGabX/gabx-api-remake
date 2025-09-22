const jwt = require('jsonwebtoken');
const { User } = require('../models');
const SearchService = require('../services/searchService');

// get all users
exports.all = async (req, res) => {
    try {
        const {
            search,
            page = 1,
            limit = 10,
            role,
            status,
            sortBy = "username",
            sortOrder = "ASC"
        } = req.query;

        // Filtres exacts
        const where = {};
        if(role) where.role = role;
        if(status) where.status = status;

        //const users = await User.findAll({ order: [['username', 'ASC']] });
        const users = await SearchService.search(User, {
            searchTerm: search,
            where,
            page: parseInt(page),
            limit: parseInt(limit),
            order: [[sortBy, sortOrder]]
            //order: [["username", "ASC"]]
        })
        // Remove password, resetCode, and resetCodeExpiresAt from each user before sending response
        const sanitizedUsers = users.rows
            ? {
                ...users,
                rows: users.rows.map(({ password, resetCode, resetCodeExpiresAt, ...rest }) => rest)
              }
            : users.map
                ? users.map(({ password, resetCode, resetCodeExpiresAt, ...rest }) => rest)
                : users;
        res.status(200).json(sanitizedUsers);
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.get = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({ where: { 'id': id } });

        if(user == null)
        {
            return res.status(404).json("Cet utilisateur n'existe pas");    
        }
        // Remove sensitive fields before sending user
        const { password, resetCode, resetCodeExpiresAt, ...sanitizedUser } = user.toJSON ? user.toJSON() : user;
        res.status(200).json(sanitizedUser);
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.me = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await User.findOne({ where: { 'id': id } });

        if(user == null)
        {
            return res.status(404).json("Cet utilisateur n'existe pas");    
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.create = async (req, res) => {
    const { username, email, role, profession } = req.body;
    const defaultPassword = process.env.DEFAULT_USER_PASSWORD || "12345678";

    try {
        const user = await User.create({ username, email, role, profession, password: defaultPassword });
        
        res.status(201).json({ message: "Utilisateur créé avec succès", "user": user });
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}


exports.update = async (req, res) => {
    
    const { id } = req.params;
    const { username, email, role, profession, status } = req.body;

    try {
        const user = await User.findOne({ where: { "id": id }});
        
        if(user != null)
        {
            if(username != null) user.username = username;
            if(email != null) user.email = email;
            if(role != null) user.role = role;
            if(profession != null) user.profession = profession;
            if(status != null) user.status = status;

            user.save();
        
            res.status(200).json({ message: "User modifié avec succès", "user": user });
        } else {
            return res.status(404).json({ message: "User inexistant" });
        }
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}

// delete any user
exports.delete = async (req, res) => {

    const { id } = req.params;

    try {
        const deletedUser = await User.destroy({ where: { "id": id }});

        if(deletedUser > 0)
        {
            res.status(200).json({ message: "Utilisateur supprimé avec succès" });
        }
        else res.status(404).json({ message: "Utilisateur inexistant" });
        
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}

// delete auth user 
exports.deleteAccount = async (req, res) => {

    // const { id } = req.params;
    try {
        const userId = req.user.id;

        //const deletedUser = await User.destroy({ where: { "id": userId }});
        const deletedUser = await User.findOne({ where: { "id": userId }});
        if(deletedUser != null)
        {
            return res.status(404).json({ message: "Utilisateur inexistant" });
        }

        deletedUser.status = "INACTIVE";
        await deletedUser.save();
        
        res.status(200).json({ message: "Utilisateur supprimé avec succès" });      
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}

// Update auth User Profile
exports.updateAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email, profession, locationCode } = req.body;
        
        const currentUser = await User.findByPk(userId);
        
        if(currentUser != null) {

            if(username != null) currentUser.username = username;
            if(email != null) currentUser.email = email;
            if(profession != null) currentUser.profession = profession;
            
            if(currentUser.role == "TENANT" || currentUser.role == "EXPERT" || currentUser.role == "ADMIN")
                if(locationCode != null) currentUser.locationCode = locationCode;

            await currentUser.save();
            
            res.status(201).json({
                message: "Profil modifié succès",
                user: {
                    "id": currentUser.id,
                    "username": currentUser.username,
                    "email": currentUser.email,
                    "profession": currentUser.profession,
                    "role": currentUser.role
                }
            });
        } else {
            res.status(404).json({
                message: "Utilisateur introuvable"
            });
        }
    } catch (err) {
        console.log("ERROR", err);
        res.status(400).json({
            message: "Impossible de modifier votre profil",
            error: err
        });
    }
}


exports.changeUserPassword = async (req, res) => {
  try {
        const userId = req.user.id;
        const { password, newPassword } = req.body;
        const user = await User.findOne({ where: { "id": userId } });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const isPasswordValid = await user.validPassword(password);
    //console.log("PASSWORD", password, "NEWPASSWORD", newPassword, "userId", userId, "VALID", isPasswordValid);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    if(newPassword != null) user.password = newPassword;

    await user.save()
    res.status(200).json({ message: 'Mot de passe modifie avec succes', "user": { "id": user.id, "name": user.name, "email": user.email, "role": user.role } });
  } catch (err) {
    res.status(400).json({ message: "Une erreur innatendue lors de la modification du mot de passe", error: err.message });
  }
}


exports.stats = async (req, res) => {
    try {
        // Compte les utilisateurs par statut et par rôle
        const totalUsers = await User.count();
        const activeUsers = await User.count({ where: { status: "ACTIVE" } });
        const inactiveUsers = await User.count({ where: { status: "INACTIVE" } });
        const suspendUsers = await User.count({ where: { status: "SUSPEND" } });

        const adminUsers = await User.count({ where: { role: "ADMIN" } });
        const expertUsers = await User.count({ where: { role: "EXPERT" } });
        const defaultUsers = await User.count({ where: { role: "DEFAULT" } });
        const tenantUsers = await User.count({ where: { role: "TENANT" } });

        res.status(200).json({
            total: totalUsers,
            active: activeUsers,
            inactive: inactiveUsers,
            suspend: suspendUsers,
            admin: adminUsers,
            expert: expertUsers,
            default: defaultUsers,
            tenant: tenantUsers
        });
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}
