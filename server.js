'use strict';

const pg = require('pg');
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT;
const app = express();
const CLIENT_URL = process.env.CLIENT_URL;
//const conString = `postgres://USER:4166@${PORT}`;
const conString = 'postgres://localhost:5432';
const client = new pg.Client(conString);
client.connect();
app.use(cors());
app.get('/test', (request, response) => response.send('Hello Garrett'));
app.get('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listenin on PORT : ${PORT}`));
