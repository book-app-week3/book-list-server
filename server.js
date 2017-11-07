'use strict';

const pg = require('pg');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
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

loadDB();

function loadBooks() {
  client.query('SELECT COUNT(*) FROM books')
    .then(result => {
      if(!parseInt(result.rows[0].count)) {
        fs.readFile('../book-list-client/data/books.json', (err, fd) => {
          JSON.parse(fd.toString()).forEach(ele => {
            client.query(`
            INSERT INTO
            books(author, title, isbn, image_url, description)
            SELECT $1, $2, $3, $4, $5
          `,
              [ele.author, ele.title, ele.isbn, ele.image_url, ele.description]
            )
              .catch(console.error);
          })
        })
      }
    })
}

function loadDB() {
  client.query(`
    CREATE TABLE IF NOT EXISTS
    books (
      book_id SERIAL PRIMARY KEY,
      author VARCHAR(30) NOT NULL,
      title VARCHAR(255) NOT NULL,
      isbn VARCHAR(30),
      image_url VARCHAR(255),
      description TEXT NOT NULL
    );`
  )
    .then(loadBooks)
    .catch(console.error);
}
