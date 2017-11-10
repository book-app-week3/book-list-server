'use strict';

const pg = require('pg');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser').urlencoded({extended: true});
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

app.post('/api/v1/books', bodyParser, (req, res) => {
  console.log(req.body);
  let {title, author, isbn, image_url, description} = req.body;
  client.query(`
    INSERT INTO books (title, author, isbn, image_url, description) VALUES ($1, $2, $3, $4, $5)`,
    [title, author, isbn, image_url, description])
    .then(results => res.sendStatus(201))
    .catch(console.error);
});

app.delete('/api/v1/books/:id', (request, response) => {
  client.query(`
    DELETE FROM books WHERE book_id=${request.params.id}`)
    .then(() => response.send(204))
    .catch(console.error);
});

app.put('/api/v1/books/:id', bodyParser, (request, response) => {
  console.log(request.body);
  client.query(`
    UPDATE books SET (title, author, isbn, image_url, description) VALUES ($1, $2, $3, $4, $5) WHERE book_id=$6`,
    [
      request.body.title,
      request.body.author,
      request.body.isbn,
      request.body.image_url,
      request.body.description,
      request.params.id
    ]
  )
    .then(() => response.send(200))
    .catch(console.error);
});

app.get('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listenin on PORT : ${PORT}`));
