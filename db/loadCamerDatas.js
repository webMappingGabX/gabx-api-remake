const { User, Region, Department, Arrondissement, Town } = require("../models");
const fs = require("fs");
const path = require('path');

const loadRegions = async () => {
    try {
        const regionsDatas = JSON.parse(fs.readFileSync(path.join(__dirname, "../fixtures/regions.json")));
        const regions = regionsDatas.map((data) => {
            return {
                "name": data.fields.name
            }
        });
        
        /*await Region.bulkCreate(regions, {
            validate: true,
            ignoreDuplicates: true
        });*/
    

        // One by one insertion
        for(const reg of regions){
            try {
                // console.log("INSERT : ", reg);
                await Region.create(reg);
            } catch (insertErr) {
                console.log("Failed to insert region:", reg.name, "Error:", insertErr.message);
                continue;
            }
        }
    
        console.log("Regions chargees avec succes");
    } catch (err) {
        console.log("ERROR", err);
    }
    // Insert all regions if not already present
    /*(async () => {
        for (const region of regions) {
            const exists = await Region.findOne({ where: { name: region.name } });
            if (!exists) {
                await Region.create(region);
            }
        }
        console.log("Regions loaded successfully");
    })();*/
}

const loadDepartments = async () => {
    
    try {
        const departmentsDatas = JSON.parse(fs.readFileSync(path.join(__dirname, "../fixtures/departments.json")))
        const departments = departmentsDatas.map((data) => {
            return {
                "name": data.fields.name,
                "regionId": data.fields.region
            }
        });
        
        /*await Department.bulkCreate(departments, {
            validate: true,
            ignoreDuplicates: true
        });*/

        // One by one insertion
        for(const dept of departments){
            try {
                // console.log("INSERT : ", dept);
                await Department.create(dept);
            } catch (insertErr) {
                console.log("Failed to insert department:", dept.name, "Error:", insertErr.message);
                continue;
            }
        }
    
        console.log("Departements charges avec succes");
    } catch (err) {
        console.log("ERROR", err);
    }
}

const loadArrondissements = async () => {
    try {
        const arrondissementDatas = JSON.parse(fs.readFileSync(path.join(__dirname, "../fixtures/arrondissements.json")))
        const arrondissements = arrondissementDatas.map((data) => {
            return {
                "name": data.fields.name,
                "departmentId": data.fields.department
            }
        });
        
        /*await Arrondissement.bulkCreate(arrondissements, {
            validate: true,
            ignoreDuplicates: true
        });*/

        // One by one insertion
        for(const arrondissement of arrondissements){
            try {
                // console.log("INSERT : ", arrondissement);
                await Arrondissement.create(arrondissement);
            } catch (insertErr) {
                console.log("Failed to insert arrondissement:", arrondissement.name, "Error:", insertErr.message);
                continue;
            }
        }
    
        console.log("Arrondissements charges avec succes");
    } catch (err) {
        console.log("ERROR", err);
    }
}

const loadTowns = async () => {
    try {
        const townsDatas = JSON.parse(fs.readFileSync(path.join(__dirname, "../fixtures/towns.json")))
        const towns = townsDatas.map((data) => {
            return {
                "name": data.fields.name,
                "arrondissementId": data.fields.arrondissement
            }
        });        
        /*await Town.bulkCreate(towns, {
            validate: false,
            ignoreDuplicates: true
        });*/

        // One by one insertion
        for(const town of towns){
            try {
                // console.log("INSERT : ", town);
                await Town.create(town);
            } catch (insertErr) {
                console.log("Failed to insert town:", town.name, "Error:", insertErr.message);
                continue;
            }
        }

        console.log("Villes chargees avec succes");
    } catch (err) {
        console.log("ERROR", err);
    }
}

const loadCamerDatas = async () => {

    // Charger les donnees des regions
    await loadRegions();

    // Charger les donnees des departements
    await loadDepartments();

    // Charger les donnees des arrondissements
    await loadArrondissements();

    // Charger les donnees des villes
    await loadTowns();

    console.log("Toutes les donees administratives du Cameroun ont ete chargees avec succes");
}

module.exports = loadCamerDatas;