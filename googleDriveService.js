const fs = require('fs');
const { google } = require("googleapis");

//const apiKeys = require("./config/apiKeys.json");

const googleApiClientEmail = process.env.GOOGLE_API_CLIENT_EMAIL;
const googleApiPrivateKey = process.env.GOOGLE_API_PRIVATE_KEY;

const SCOPE = ["https://www.googleapis.com/auth/drive"];

async function authorize() {
    const jwtClient = new google.auth.JWT(
        googleApiClientEmail, //apiKeys.client_email,
        null,
        googleApiPrivateKey, //apiKeys.private_key,
        SCOPE
    );

    await jwtClient.authorize();

    return jwtClient;
}

async function uploadFile(authClient, filename, buffer) {
    return new Promise((resolve, rejected) => {
        const drive = google.drive({version: "v3", auth: authClient});

        var fileMetaData = {
            name: filename,
            parents: ["1Y0f9nnqYs0mrKboq71U7WrTAwsk9X1RE"]
        }

        drive.files.create({
            resource: fileMetaData,
            media: {
                body: require('stream').Readable.from(buffer),
                mimeType: "application/json"
            },
            fields: 'id,name,webViewLink'
        }, (err, file) => {
            if(err) return rejected(err);

            resolve(file)
        });

    });
}

async function getFile(authClient, fileId) {
    const drive = google.drive({ version: "v3", auth: authClient });

    const response = drive.files.get({
        fileId: fileId,
        alt: 'media'
      });
      return response;

    /*return new Promise((resolve, reject) => {
        const drive = google.drive({ version: "v3", auth: authClient });

        drive.files.get(
            { fileId: fileId, alt: "media" },
            { responseType: "stream" },
            (err, res) => {
                if (err) {
                    console.error("Error while getting file:", err.message);
                    return reject(err);
                }

                const filePath = `./downloaded_${fileId}.json`;
                const dest = fs.createWriteStream(filePath);

                res.data
                    .on("end", () => resolve(res))
                    .on("error", (err) => reject(err))
                    .pipe(dest);
            }
        );
    });*/
}

/*async function replaceFile(authClient, fileId, newFilePath) {
    try {
        // Delete the existing file
        await deleteFile(authClient, fileId);

        // Upload the new file
        const newFileName = newFilePath.split('/').pop();
        const buffer = fs.readFileSync(newFilePath);
        const newFile = await uploadFile(authClient, newFileName, buffer);

        return newFile;
    } catch (err) {
        console.error("Error replacing file:", err);
        throw err;
    }
}*/

async function deleteFile(authClient, fileId) {
    return new Promise((resolve, reject) => {
        const drive = google.drive({ version: "v3", auth: authClient });

        drive.files.delete({ fileId: fileId }, (err, res) => {
            if (err) return reject(err);

            resolve(res);
        });
    });
}

exports.uploadFile = async (filename, buffer) => {
    try
    {
        const authClient = await authorize();
        const file = await uploadFile(authClient, filename, buffer);

        return file;
    } catch (err) {
        console.log("\n ERROR UPLOADING FILE", err);
    }
}

exports.getDriveFile = async (fileId) => {

    try
    {
        const authClient = await authorize();
        const file = await getFile(authClient, fileId);

        return file;
    } catch (err) {
        console.log("\n ERROR UPLOADING FILE", err);
    }
}

/*exports.updateDriveFile = async (fileId, updatedFilename) => {
    try
    {
        const authClient = await authorize();
        const file = await updateFile(authClient, fileId, updatedFilename);

        console.log("UPDATED FILE", file);

        return file;
    } catch (err) {
        console.log("\n ERROR UPDATING FILE", err);
    }   
};*/

exports.deleteDriveFile = async (fileId) => {

    try
    {
        const authClient = await authorize();
        const file = await deleteFile(authClient, fileId);

        return file;
    } catch (err) {
        console.log("\n ERROR DELETING FILE", err);
    }
};

// https://drive.google.com/file/d/1RfLnPrPAwiSS_fTLyFBCJXlJsfQPsxMh/view?usp=drive_link