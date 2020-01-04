const express = require('express');
const bodyParser = require('body-parser');
//const getUsers = require('./queries.js');
const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const fs = require('fs');
const path = require('path');

var app = express();
app.listen(4000, function () {
    console.log('Server is running...on Port 4000');
}); 
app.use(bodyParser.json())
app.use( 
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/reviews/:product_id/list', function (req, res, next) {
  getReviews(req, res);
});

app.get('/reviews/:product_id/meta', function (req, res, next) {
  getMeta(req, res);
});

app.post('/reviews/:product_id', function (req, res, next) {
  postReview(req, res);
});

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'maxdorfman',
  host: 'localhost',
  database: 'reviewsapi',
  password: 'mnm',
  port: 5432,
})

const getReviews = (request, response) => {
    pool.query(`SELECT * FROM reviews WHERE product_id = ${request.params.product_id}`, (error, results) => { 
      if (error) {
        response.status(400)
        throw error
      }
      var len = results.rows.length-1;
      for (var i=0; i<results.rows.length; i++){
        var counter = 0;
        pool.query(`SELECT * FROM photos WHERE review_id = ${results.rows[i].id}`, (error, result) => { 
          if (error) {
            response.status(400)
            throw error
          }
         
         results.rows[counter].photos = result.rows;
         counter++;
         if (counter > len){
          response.status(200).json(results.rows)
         }
        })
      }
    })
  }

//SELECT reviews.*,photos.* FROM reviews LEFT JOIN photos ON reviews.id = photos.review_id WHERE reviews.product_id = 4;

  const getMeta = (request, response) => {
    var metaObj = {product_id: request.params.product_id};
    metaObj.ratings = {};
    pool.query(`SELECT rating FROM reviews WHERE product_id = ${request.params.product_id}`, (error, ratingResults) => { 
      if (error) {
        response.status(400)
        throw error
      }
      for (var i=0; i<ratingResults.rows.length; i++){
        metaObj.ratings[i] = ratingResults.rows[i].rating;
      }
      metaObj.recommended = {};
      pool.query(`SELECT recommend FROM reviews WHERE product_id = ${request.params.product_id}`, (error, recResults) => { 
        if (error) {
          response.status(400)
          throw error
        }
        var recCount = 0;
        for (var i=0; i<recResults.rows.length; i++){
          if(recResults.rows[i] === true){
            recCount++;
          }
        }
        metaObj.recommended['0'] = recCount;
        pool.query(`SELECT characteristics FROM characteristics WHERE product_id = ${request.params.product_id}`, (error, charResults) => { 
          if (error) {
            response.status(400)
            throw error
          }
          metaObj.characteristics = charResults.rows[0].characteristics;
          response.status(200).json(metaObj)
        })
      })
    })
  }

  const postReview = (request, response) => {
    var revid = 0;
    pool.query(`SELECT reviewnum FROM reviewid WHERE id=1`, (error, results) => { 
      if (error) {
        response.status(400)
        throw error
      }
      revid = results.rows[0].reviewnum;
      pool.query(`INSERT INTO reviews (id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness) VALUES (${revid+1},${request.params.product_id},${request.body.rating},${request.body.date},'${request.body.summary}','${request.body.body}','${request.body.recommend}',${request.body.reported},'${request.body.reviewer_name}','${request.body.reviewer_email}','${request.body.response}',${request.body.helpfulness})`, (error, results) => { 
        if (error) {
          response.status(400)
          throw error
        } 
        pool.query(`UPDATE reviewid SET reviewnum = ${revid+1} WHERE id=1`, (error, results) => { 
          if (error) {
            response.status(400)
            throw error
          }
          response.sendStatus(200)
        })
      }) 
    })
  }


