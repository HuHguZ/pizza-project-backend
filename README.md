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
 * Or copy the contents of this file, log in to the server and paste
 
 ### Deployment
 
 Run this command using any available process manager:<br>
 ```$ node index.js```