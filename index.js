const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

main();

async function main() {

    const mysql = require('mysql2');

    const pool = mysql.createPool({
        host: process.env.DB_HOST, 
        user: process.env.DB_USER, 
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    });
  
    const promisePool = pool.promise();

    app.listen(process.env.PORT || 5000);

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());

    app.use(express.static('public'));

    app.get('/api/getProduct/:id', async (req, res) => {
        const [rows] = await promisePool.execute('SELECT * FROM `products` where id = ?', [req.params.id]);
        res.send(rows);
    });
}