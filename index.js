const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

main();

async function main() {

    const mysql = require('mysql2/promise');

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST, 
        user: process.env.DB_USER, 
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    });

    try {
        await connection.ping();
        console.log('Successful database connection!');
    } catch (e) {
        throw e;
    }

    const port = process.env.SERVER_PORT || 5000;

    app.listen(port, () => {
        console.log('Server running on port', port);
    });

    app.use(cors());

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());

    app.use(express.static('public'));

    app.get('/api/getProduct/:id', async (req, res) => {
        try {
            const [rows] = await connection.execute('select * from `products` where id = ?', [req.params.id]);
            res.send(rows);
        } catch (e) {
            console.error(e);
            res.send([]);
        }
    });

    app.post('/api/sendOrder', async (req, res) => {
        try {
            const { phone, deliveryAdress, products } = req.body;
            await connection.beginTransaction();
            const [[{ maxCartId }]] = await connection.execute('select max(cart_id) as maxCartId from carts');
            const [[{ maxUserId }]] = await connection.execute('select max(id) as maxUserId from users');
            const userId = maxUserId + 1;
            const cartId = maxCartId + 1;
            await connection.query('insert into users values (?, ?, ?, ?)', [userId, phone, deliveryAdress, cartId]);
            for (const [productId, count] of Object.entries(products)) {
                const insertValues = [cartId, userId, productId, count];
                await connection.query('insert into carts (cart_id, user_id, product_id, product_count) values (?, ?, ?, ?)', insertValues);
            }
            await connection.commit();
            notifyAboutOrder(userId);
            res.send({
                success: true
            });
        } catch (e) {
            await connection.rollback();
            console.error(e);
            res.send({
                success: false
            })
        }
    });

    const notifyAboutOrder = async userId => {
        const [rows] = await connection.execute(`
            select carts.cart_id, name, product_count, price, product_count * price as product_sum, phone, delivery_address from carts
            inner join products
            on product_id = products.id 
            inner join users
            on user_id = users.id
            where user_id = ?
        `, [userId]);
        let totalSum = 0;
        const { phone, delivery_address, cart_id } = rows[0];
        let sqlresult = `Заказ №${cart_id}\nНомер телефона клиента: ${phone}\nАдрес доставки: ${delivery_address}\n`;
        for (const { name, product_count, product_sum, price } of rows) {
            totalSum += product_sum;
            sqlresult += `${name} стоимостью ${price.toFixed(2)}$ ${product_count} шт. на сумму ${product_sum.toFixed(2)}$\n`;
        }
        sqlresult += `__________________________\nИтого: ${totalSum.toFixed(2)}$`;
        const [telegramUsers] = await connection.execute('select * from telegram_notifications');
        for (const { telegram_user_id } of telegramUsers) {
            await bot.sendMessage(telegram_user_id, sqlresult);
        }
    };

    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
        polling: true
    });

    bot.onText(/\/start\s+(\S+)/i, async (msg, match) => {
        const [, password] = match;
        if (password == process.env.BOT_PASSWORD) {
            const chatId = msg.chat.id;
            const { first_name = '', last_name = '' } = msg.chat;
            const [[{ exists }]] = await connection.execute('select exists(select * from telegram_notifications where telegram_user_id = ?) as `exists`', [chatId]);
            if (exists) {
                return bot.sendMessage(chatId, `${first_name} ${last_name} already exists`);
            }
            await connection.query('insert into telegram_notifications values (?)', [chatId]);
            return bot.sendMessage(chatId, `${first_name} ${last_name} saved to database`);
        }
    });

}