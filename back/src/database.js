const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    multipleStatements: true
});

connection.connect(async (err) => {
    if (err) {
        console.error('Erreur lors de la connexion au serveur MySQL: ' + err.stack);
        return;
    }
    console.log('Connecté au serveur MySQL.');

    const dbName = process.env.DATABASE_NAME;

    connection.query(`SHOW DATABASES LIKE '${dbName}'`, async (err, results) => {
        if (err) {
            console.error('Erreur lors de la vérification de la base de données: ' + err.stack);
            return;
        }

        if (results.length === 0) {
            connection.query(`CREATE DATABASE ${dbName}`, (err) => {
                if (err) {
                    console.error('Erreur lors de la création de la base de données: ' + err.stack);
                    return;
                }
                console.log(`Base de données ${dbName} créée avec succès.`);
                executeSQLFile();
            });
        } else {
            executeSQLFile();
        }
    });
});

function executeSQLFile() {
    const schemaFilePath = path.join(__dirname, '../sql/data.sql');

    fs.readFile(schemaFilePath, 'utf8', (err, sql) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier SQL: ' + err.stack);
            return;
        }

        connection.query(sql, (err) => {
            if (err) {
                console.error('Erreur lors de l\'exécution du fichier SQL: ' + err.stack);
                return;
            }
            console.log('Table créée ou déjà existante.');

            const { parseAllCSVsAndInsertData } = require('./parser');

            parseAllCSVsAndInsertData(connection);
        });
    });
}

module.exports = connection;
