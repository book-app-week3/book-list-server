'use strict';

const pg = require('pg');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const fs = require('fs');

const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
app.use(cors());
app.get('/api/v1/books', (request, response) => {
  client.query(`SELECT book_id, title, author, image_url FROM books`)
    .then(results => response.send(results.rows))
    .catch(console.error)
});

app.get('/api/v1/books/:id', (request, response) => {
  client.query(`SELECT * FROM books WHERE book_id=${request.params.id}`)
    .then(results => response.send(results.rows))
    .catch(console.error)
});

app.post('/books/new', bodyParser, (req, res) => {
  let {title, author, isbn, image_url, description} = req.body;
  client.query(`
    INSERT INTO books (title, author, isbn, image_url, description) VALUES ($1, $2, $3, $4, $5)`,
    [title, author, isbn, image_url, description])
    .then(() => res.sendStatus(201))
    .catch(console.error);
});

app.get('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listenin on PORT : ${PORT}`));
