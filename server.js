const http = require('http');
const dotenv = require('dotenv');
dotenv.config({path: `.env`});


const {app} = require('./app')
const server = http.createServer(app)
const PORT = process.env.PORT

server.listen(PORT, () => {
    console.log(`
    =======================================================

        Started Server on
        Port Number : ${PORT}

    =======================================================
    `);
});