// Retrieve
var MongoClient = require('mongodb').MongoClient;

const dbConn = () =>
  MongoClient.connect('mongodb://localhost:27017/local').catch(error => {
    console.log('failed db connection');
    console.error(error);
  });

const setupDBStructure = connection => {
  const db = connection.db('sheerlinDB');
  db.createCollection('imdb');
  return db;
};

const db = dbConn()
  .then(setupDBStructure)
  .then(db => {
    db
      .collection('imdb')
      .insertOne(
        { name: 'Company Inc...', address: 'Highgugugway 37' },
        (err, res) => {
          if (err) throw err;
          console.log('1 document inserted');
        },
      );
  });

const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

const main = async function() {
  const a = await fetch('https://www.imdb.com/name/nm5397459/?ref_=nmmi_mi_nm')
    .then(res => res.text())
    .catch(console.error);

  const $ = cheerio.load(a);
  $('h1.header').each(function(i, element) {
    const title = $(this)
      .children()
      .html();
    console.log(title);
  });

  $('td.img_primary').each(function(i, element) {
    const b = $(this).children();
    //.attr('src');

    //.children()
    //.children();
    //.attr('class');
    console.log(b.text());
  });

  //   fs.writeFile('info.html', parsedHTML.html(), err => {
  //     if (err) {
  //       return console.error(err);
  //     }
  //     console.log('SUCESS');
  //   });
};

main();
