const express = require('express');
const router = express.Router();
const db = require('../database');

//route to get everything from the data
router.get('/data', (req, res) => {
    const sql = 'SELECT * FROM data';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération des données: ' + err.stack);
            res.status(500).send('Erreur lors de la récupération des données');
            return;
        }
        res.json(result);
    });
});

//route to get all the countries
router.get('/countries', (req, res) => {
    const sql = 'SELECT DISTINCT country FROM data';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération des pays: ' + err.stack);
            res.status(500).send('Erreur lors de la récupération des pays');
            return;
        }
        res.json(result);
    });
});

//route to get all the provinces of a country
router.get('/provinces/:country', (req, res) => {
    const sql = 'SELECT DISTINCT province FROM data WHERE country = ?';

    db.query(sql, [req.params.country], (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération des provinces: ' + err.stack);
            res.status(500).send('Erreur lors de la récupération des provinces');
            return;
        }
        res.json(result);
    });
});

//route to get confirmed from a country
router.get('/confirmed/:country', (req, res) => {
    const sql = 'SELECT SUM(confirmed) AS confirmed FROM data WHERE country = ?';

    db.query(sql, [req.params.country], (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération des cas confirmés: ' + err.stack);
            res.status(500).send('Erreur lors de la récupération des cas confirmés');
            return;
        }
        res.json(result);
    });
});

//route to get deaths from a country
router.get('/deaths/:country', (req, res) => {
    const sql = 'SELECT SUM(deaths) AS deaths FROM data WHERE country = ?';

    db.query(sql, [req.params.country], (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération des décès: ' + err.stack);
            res.status(500).send('Erreur lors de la récupération des décès');
            return;
        }
        res.json(result);
    });
});

//route to get recovered from a country
router.get('/recovered/:country', (req, res) => {
    const sql = 'SELECT SUM(recovered) AS recovered FROM data WHERE country = ?';

    db.query(sql, [req.params.country], (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération des guérisons: ' + err.stack);
            res.status(500).send('Erreur lors de la récupération des guérisons');
            return;
        }
        res.json(result);
    });
});

//route to get all confirmed from all country
router.get('/allconfirmed', (req, res) => {
    const sql = 'SELECT SUM(confirmed) AS confirmed FROM data';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération des cas confirmés: ' + err.stack);
            res.status(500).send('Erreur lors de la récupération des cas confirmés');
            return;
        }
        res.json(result);
    });
});

//route to get data from last mouth
router.get('/lastmonth', (req, res) => {
    const getMaxDateSql = 'SELECT MAX(date) AS max_date FROM data';

    db.query(getMaxDateSql, (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération de la date la plus récente: ' + err.stack);
            res.status(500).send('Erreur lors de la récupération de la date la plus récente');
            return;
        }

        const maxDate = result[0].max_date;
        // console.log('max date:', maxDate);

        const formattedMaxDate = maxDate.toISOString().split('T')[0];

        const getPreviousDateSql = `SELECT DATE_SUB('${formattedMaxDate}', INTERVAL 1 MONTH) AS previous_date`;

        db.query(getPreviousDateSql, (err, previousResult) => {
            if (err) {
                console.error('Erreur lors de la récupération de la date précédente: ' + err.stack);
                res.status(500).send('Erreur lors de la récupération de la date précédente');
                return;
            }

            const previousDate = previousResult[0].previous_date;
            // console.log('previous date:', previousDate);

            if (!previousDate) {
                console.error('Aucune date précédente trouvée');
                res.status(404).send('Aucune date précédente trouvée');
                return;
            }

            // Modifier la requête pour inclure la colonne 'country'
            const getComparisonSql = `
                SELECT d1.country,
                    d1.combined_key,
                    d1.latitude,
                    d1.longitude,
                    d1.confirmed AS confirmed_max, 
                    d2.confirmed AS confirmed_previous,
                    (d1.confirmed - d2.confirmed) AS confirmed_difference,
                    d1.deaths AS deaths_max, 
                    d2.deaths AS deaths_previous,
                    (d1.deaths - d2.deaths) AS deaths_difference,
                    d1.recovered AS recovered_max,
                    d2.recovered AS recovered_previous,
                    (d1.recovered - d2.recovered) AS recovered_difference
                FROM data d1
                LEFT JOIN data d2 ON d1.combined_key = d2.combined_key AND d2.date = ?
                WHERE d1.date = ?;
            `;

            db.query(getComparisonSql, [previousDate, formattedMaxDate], (err, dataResult) => {
                if (err) {
                    console.error('Erreur lors de la récupération des données: ' + err.stack);
                    res.status(500).send('Erreur lors de la récupération des données');
                    return;
                }

                if (dataResult.length === 0) {
                    res.status(404).send('Pas de données trouvées pour la période spécifiée');
                } else {
                    res.json(dataResult);
                }
            });
        });
    });
});

//route to get data week by week for 1 year
router.get('/allweek', (req, res) => {
    const sql = 'SELECT YEAR(date) AS year, WEEK(date) AS week, SUM(confirmed) AS total_confirmed, SUM(deaths) AS total_deaths, SUM(recovered) AS total_recovered FROM data WHERE date >= (CURDATE() - INTERVAL 1 YEAR) GROUP BY YEAR(date), WEEK(date) ORDER BY YEAR(date) DESC, WEEK(date) DESC';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération des cas confirmés: ' + err.stack);
            res.status(500).send('Erreur lors de la récupération des cas confirmés');
            return;
        }
        res.json(result);
    });
})

//route to get data from last day
router.get('/lastday', (req, res) => {
    const getMaxDateSql = 'SELECT MAX(date) AS max_date FROM data';

    db.query(getMaxDateSql, (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération de la date la plus récente: ' + err.stack);
            res.status(500).send('Erreur lors de la récupération de la date la plus récente');
            return;
        }
        const maxDate = result[0].max_date;
        const formattedDate = new Date(maxDate).toISOString().split('T')[0]; // Format YYYY-MM-DD

        const getDataSql = `SELECT * FROM data WHERE date = '${formattedDate}' ORDER BY date DESC`;

        db.query(getDataSql, (err, dataResult) => {
            if (err) {
                console.error('Erreur lors de la récupération des données: ' + err.stack);
                res.status(500).send('Erreur lors de la récupération des données');
                return;
            }
            res.json(dataResult);
        });
    });
});

//route to get day by day
router.get('/daily', (req, res) => {
    const sqlLatestDate = 'SELECT MAX(date) AS max_date FROM data';

    db.query(sqlLatestDate, (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération de la date la plus récente: ' + err.stack);
            res.status(500).send('Erreur lors de la récupération de la date la plus récente');
            return;
        }

        const latestDate = result[0].max_date;
        const formattedDate = new Date(latestDate).toISOString().split('T')[0];
        // console.log('latest date:', formattedDate);

        // Récupérer les données jour par jour pour une semaine
        const sql = `
            SELECT 
                DATE(date) AS date, 
                SUM(confirmed) AS confirmed, 
                SUM(deaths) AS deaths, 
                SUM(recovered) AS recovered 
            FROM data 
            WHERE date >= (DATE('${formattedDate}') - INTERVAL 8 DAY)
            GROUP BY DATE(date) 
            ORDER BY DATE(date) DESC
        `;

        db.query(sql, (err, result) => {
            if (err) {
                console.error('Erreur lors de la récupération des cas: ' + err.stack);
                res.status(500).send('Erreur lors de la récupération des cas');
                return;
            }
            res.json(result);
        });
    });
});

module.exports = router;
