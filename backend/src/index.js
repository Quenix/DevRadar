const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const http = require('http');
const { setupWebsocket } = require('./websocket');
require('dotenv').config();

const app = express();
const server = http.Server(app);

const user = process.env.USERNAME;
const password = process.env.PASSWORD;

setupWebsocket(server);

mongoose.connect(`mongodb+srv://${user}:${password}@cluster0-6zg9y.mongodb.net/week10?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);
console.log(process.env.APP_NAME)