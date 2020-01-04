DROP DATABASE IF EXISTS reviewsapi;
CREATE DATABASE reviewsapi;
\c reviewsapi

DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS characteristics;
DROP TABLE IF EXISTS reviews;

CREATE TABLE characteristics(
    id              SERIAL PRIMARY KEY, 
    product_id      INTEGER,
    name            VARCHAR(50)
);

CREATE TABLE reviews(
    id              SERIAL PRIMARY KEY,
    product_id      INTEGER,
    rating          INTEGER,
    date            VARCHAR(50),
    summary         VARCHAR(500), 
    body            VARCHAR(1000),                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
    recommend       BOOLEAN, 
    reported        BOOLEAN,  
    reviewer_name   VARCHAR(50), 
    reviewer_email  VARCHAR(50),                 
    response        VARCHAR(500),                                            
    helpfulness     INTEGER
);

CREATE TABLE photos(
    id              SERIAL PRIMARY KEY,
    review_id       INTEGER REFERENCES reviews(id),
    url             VARCHAR(200)
);

CREATE TABLE reviewid(
    id              SERIAL PRIMARY KEY,
    reviewnum       INTEGER 
);

COPY characteristics(id,product_id,name) 
FROM '/Users/maxdorfman/Documents/projectGFData/characteristics.csv' DELIMITER ',' CSV HEADER;

COPY reviews(id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness) 
FROM '/Users/maxdorfman/Documents/projectGFData/reviews.csv' DELIMITER ',' CSV HEADER;

COPY reviews(id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness) 
FROM '/Users/maxdorfman/Documents/projectGFData/newReviews.csv' DELIMITER ',' CSV HEADER;

COPY photos(id,review_id,url) 
FROM '/Users/maxdorfman/Documents/projectGFData/reviews_photos.csv' DELIMITER ',' CSV HEADER;

CREATE INDEX ON reviews (product_id);
CREATE INDEX ON photos (review_id); 
CREATE INDEX ON characteristics (product_id);

INSERT INTO reviewid(reviewnum)
VALUES
   (15777922);
