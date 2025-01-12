// parser.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function handleEmptyValue(value) {
    return value === undefined || value === '' ? null : value;
}

function formatDateFromFileName(fileName) {
    const [month, day, year] = fileName.split('-');
    return `${year}-${month}-${day}`;
}

async function parseCSVAndInsertData(csvFilePath, connection) {
    const fileNameWithExtension = path.basename(csvFilePath);
    const fileNameWithoutExtension = path.parse(fileNameWithExtension).name;

    const date = formatDateFromFileName(fileNameWithoutExtension);

    const rows = [];

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
            rows.push(row);
        })
        .on('end', async () => {
            console.log(`Fichier CSV ${fileNameWithExtension} traité avec succès.`);

            for (const row of rows) {
                const {
                    FIPS, Admin2, Province_State, Country_Region, Last_Update, Lat, Long_,
                    Confirmed, Deaths, Recovered, Active, Combined_Key, Incident_Rate, Case_Fatality_Ratio
                } = row;

                // Vérification avec la date incluse
                const checkSql = `SELECT COUNT(*) AS count FROM data WHERE combined_key = ? AND date = ?`;
                connection.query(checkSql, [Combined_Key, date], (err, results) => {
                    if (err) {
                        console.error('Erreur lors de la vérification des données: ' + err.stack);
                        return;
                    }

                    if (results[0].count === 0) {
                        const insertSql = `INSERT INTO data (
                            date, province, country, last_update, latitude, longitude, confirmed, deaths, recovered, active, combined_key, incident_rate, case_fatality_ratio
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                        connection.query(insertSql, [
                            date,
                            handleEmptyValue(Province_State),
                            handleEmptyValue(Country_Region),
                            handleEmptyValue(Last_Update),
                            handleEmptyValue(Lat),
                            handleEmptyValue(Long_),
                            handleEmptyValue(Confirmed),
                            handleEmptyValue(Deaths),
                            handleEmptyValue(Recovered),
                            handleEmptyValue(Active),
                            handleEmptyValue(Combined_Key),
                            handleEmptyValue(Incident_Rate),
                            handleEmptyValue(Case_Fatality_Ratio)
                        ], (err, result) => {
                            if (err) {
                                console.error('Erreur lors de l\'insertion des données: ' + err.stack);
                                return;
                            }
                            console.log(`Données insérées pour la ligne avec la clé : ${Combined_Key} et la date : ${date}`);
                        });
                    } else {
                        // console.log(`Les données pour la clé ${Combined_Key} existent déjà.`);
                    }
                });

                await sleep(100);
            }
            console.log('Données insérées dans la base de données pour ce fichier.');
        });
}

async function parseAllCSVsAndInsertData(connection) {
    const csvDirPath = path.join(__dirname, '../csv');

    fs.readdir(csvDirPath, (err, files) => {
        if (err) {
            console.error('Erreur lors de la lecture du dossier CSV: ' + err.stack);
            return;
        }
        const csvFiles = files.filter(file => path.extname(file) === '.csv');

        csvFiles.forEach(async (file) => {
            const csvFilePath = path.join(csvDirPath, file);
            await parseCSVAndInsertData(csvFilePath, connection);
        });
    });
}

module.exports = {
    parseAllCSVsAndInsertData,
    parseCSVAndInsertData,
    handleEmptyValue,
    formatDateFromFileName,
    sleep,
};
