const { User } = require("../models");


const createAdmin = async () => {

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "handsome.nearby@gmail.com";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "1234567a";

    // Verify if admin already exists
    
    const isAdminExists = await User.findOne( { where: { email : ADMIN_EMAIL }});

    if(isAdminExists != null) return;

    await User.create({
        "username" : ADMIN_USERNAME,
        "email" : ADMIN_EMAIL,
        "password" : ADMIN_PASSWORD,
        "role": "ADMIN",
        "status": "ACTIVE"
    });

    console.log("Administrateur par defaut configuré avec success");
}

module.exports = createAdmin