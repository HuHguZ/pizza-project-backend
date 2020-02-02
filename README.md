# Pizza project backend

Backend for pizza project. You should deploy it before deploying frontend.

## Getting Started

clone this repository:

```
$ git clone https://github.com/HuHguZ/pizza-project-backend.git
```

### Prerequisites

* Node.js
* MySQL

### Installing

```
$ npm install
```

rename ```.env.example``` to ```.env``` and fill it. File structure:

```
SERVER_PORT=5000
TELEGRAM_BOT_TOKEN=987765750:AAE1EXVGMTrhaihu6QC-RHEgwurDUpYhQAY
BOT_PASSWORD=00c5f2a5f00a4deda3dd5ad1e44d9463486ea3e0974c0cdf10e1b759910a6b45
DB_HOST=localhost
DB_USER=username
DB_PASS=password
DB_NAME=innoscripta_pizza
```
If you want to change the database name, you should also change it in the file ```initializeDB.sql```<br>
Then exec sql-file on server:
 * ```$ mysql -u username -p password innoscripta_pizza < /path/to/your/initializeDB.sql```
 <br>Alternatively if you have already logged in to the server, just run:
 * ```mysql>source /path/to/your/file.sql```<br>
 * Or copy the contents of this file, log in to the server and paste.
 
 ### Telegram notifications
 To receive notifications about user orders, you should change ```TELEGRAM_BOT_TOKEN``` and ```BOT_PASSWORD``` in ```.env``` file or leave the same if you want to use my bot.<br>
 Then send the command ```/start <BOT_PASSWORD>``` to the created bot so it saves you to the database and will notify you about user orders.
 ### Deployment
 
 Run this command using any available process manager:<br>
 ```$ node index.js```
