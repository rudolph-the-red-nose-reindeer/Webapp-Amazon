var config = require('./db-config.js');
var mysql = require('mysql');
var oracledb = require('oracledb');

let connection;
async function run() {
  oracledb.outFormat = oracledb.OBJECT;
  connection = await oracledb.getConnection(config);
}
run();


async function getAllCategories(req, res) {
  var query =
    `SELECT *
    FROM (SELECT DISTINCT Category FROM Category
    GROUP BY Category
    ORDER BY COUNT(*) DESC)
    WHERE rownum <=20`;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};

async function getTopProductsInCategory(req, res) {
  var inputCategory = req.params.category;
  var query = `
  SELECT * FROM (
    WITH products AS (SELECT Asin
    FROM Category
    WHERE Category = '${inputCategory}'),
    ratings AS (SELECT  Asin, AVG(Overall) AS rating, COUNT(*) AS numReviews
    FROM Review
    GROUP BY Asin)
    SELECT PR.title, R.rating, R.numReviews
    FROM products P JOIN ratings R ON P.Asin=R.Asin JOIN Product PR ON P.Asin = PR.Asin
    ORDER BY R.rating DESC, R.numReviews DESC
  ) WHERE rownum <=10`;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};



//PRODUCTS
async function getProductInfo(req, res) {
  var inputName = req.params.product;
  var query =
    `
  SELECT * FROM(
  SELECT P.Description, P.price, P.brand, RE.Name, R.reviewText, R.Overall, R.reviewDate
  FROM Product P LEFT JOIN Review R ON R.Asin=P.Asin LEFT JOIN Reviewer RE ON R.reviewerID = RE.reviewerID
  WHERE R.Asin IN (SELECT Asin
  FROM Product
  WHERE title = '${inputName}')
  ORDER BY CASE WHEN R.Overall IS NULL THEN 1 ELSE 0 END, R.Overall DESC) WHERE rownum <= 10
  `;
  //Gets product info and reviews about it
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }

};

//gets the number of reviews, average rating for a product
async function getProductStats(req, res) {
  var inputTitle = req.params.product;
  console.log(inputTitle);
  var query = `
    SELECT COUNT(*) AS numReviews, AVG(R.Overall) AS rating
    FROM Review R JOIN Product P ON R.Asin = P.Asin
    WHERE P.title = '` + inputTitle + `'
    GROUP BY R.Asin
    `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
}

//gets the top products from a selected brand (title, description, price, avg)
async function getTopProductsInBrand(req, res) {
  var inputBrand = req.params.brand;
  var query = `
    SELECT * FROM(
    SELECT P.title, P.Description, P.price, AVG(R.Overall) AS rating
    FROM Product P LEFT JOIN Review R ON R.Asin=P.Asin
    WHERE P.brand = '` + inputBrand + `'
    GROUP BY P.title, P.Description, P.price
    ORDER BY CASE WHEN AVG(R.Overall) IS NULL THEN 1 ELSE 0 END, AVG(R.Overall) DESC,
    COUNT(*) DESC) WHERE rownum <= 10
    `;

  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};

//get the number of reviews, avg rating of most reviewed brands
async function getMostReviewedBrands(req, res) {
  var query = `
    SELECT * FROM(
    SELECT P.brand, COUNT(*) AS numReviews, AVG(R.Overall) AS aveRating
    FROM Product P JOIN Review R ON R.Asin= P.Asin
    WHERE P.brand IS NOT NULL
    GROUP BY P.brand
    ORDER BY COUNT(*) DESC, AVG(R.Overall) DESC) WHERE rownum <= 10
  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};

//gets the most expensive products for each brand (title,description, price, avg rating)
async function getMostExpensiveProductsInBrand(req, res) {
  var inputBrand = req.params.brand;
  var query = `
    SELECT * FROM(
    SELECT P.title, P.Description, P.price, AVG(R.Overall) AS AveRating
    FROM Product P LEFT JOIN Review R ON R.Asin=P.Asin
    WHERE P.brand = '` + inputBrand + `'
    GROUP BY P.title, P.Description, P.price
    ORDER BY CASE WHEN P.price IS NULL THEN 1 ELSE 0 END, P.price DESC,
    CASE WHEN AVG(R.Overall) IS NULL THEN 1 ELSE 0 END, AVG(R.Overall) DESC,
    COUNT(*) DESC) WHERE rownum <= 10
  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};

//gets the average rating, avg price for a brand
async function getBrandStats(req, res) {
  var inputBrand = req.params.brand;
  var query = `
    SELECT AVG(R.Overall) AS aveRating, AVG(P.price) AS avePrice
    FROM Review R RIGHT JOIN Product P ON R.Asin = P.Asin
    WHERE P.brand = '` + inputBrand + `'
    GROUP BY P.brand
  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};

//What does this do??
async function getRelations(req, res) {
  var query = `
    SELECT DISTINCT label FROM related
  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};


//Gets the title, description, price, and average rating for a given title
async function getRelated(req, res) {
  var inputTitle = req.params.title;
  console.log(inputTitle);
  var inputLabel = req.params.relation;
  console.log(inputLabel);
  var query = `
    SELECT * FROM(
    SELECT PR.title, PR.Description, PR.price, AVG(RE.Overall) AS aveRatings
    FROM product P JOIN related R ON P.Asin=R.Asin JOIN Product PR
    ON R.asinRelated = PR.Asin LEFT JOIN Review RE ON RE.Asin = PR.Asin
    WHERE P.title = '` + inputTitle + `' AND R.label = '` + inputLabel + `'
    GROUP BY PR.title, PR.Description, PR.price
    ORDER BY CASE WHEN AVG(RE.Overall) IS NULL THEN 1 ELSE 0 END,
    AVG(RE.Overall) DESC, CASE WHEN PR.price IS NULL THEN 1 ELSE 0 END,
    PR.price DESC
    ) WHERE rownum <=10
  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};


//REVIEWERS

//gets the top 5 reviewers by number of reviews
async function getTopReviewers(req, res) {
  var query = `
    SELECT * FROM(
    SELECT RE.Name, COUNT(*) AS numReviews
    FROM Review R JOIN Reviewer RE ON R.reviewerID = RE.reviewerID
    GROUP BY RE.Name
    ORDER BY COUNT(*) DESC) WHERE rownum <= 5
  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};

//Gets the time that the reviewer has spent writing reviews
async function getReviewerTime(req, res) {
  var inputName = req.params.reviewer;
  var query = `
    SELECT * FROM(
    SELECT P.title AS productName, R.Overall AS rating, R.reviewText AS review, R.time AS time
    FROM Review R JOIN Product P ON R.Asin = P.Asin JOIN Reviewer RE ON R.reviewerID = RE.reviewerID
    WHERE RE.name = '` + inputName + `'
    ORDER BY R.time DESC, P.title) WHERE rownum <= 10
  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};

//Gets the top products that a reviewer has reviewed (productName, rating, review, time)
async function getTopReviewsByReviewer(req, res) {
  var inputName = req.params.reviewer;
  var query = `
  SELECT * FROM(
    SELECT P.title AS productName, R.Overall AS rating, R.reviewText AS review, R.time AS time
    FROM Review R JOIN Product P ON R.Asin = P.Asin JOIN Reviewer RE ON R.reviewerID = RE.reviewerID
    WHERE RE.name = '` + inputName + `'
    ORDER BY R.Overall DESC, P.title) WHERE rownum <= 10
  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};




async function getReviewerStats(req, res) {
  var inputName = req.params.reviewer;
  var query =
    `
    SELECT RE.Name, COUNT(*) AS numReviews, AVG(R.Overall) AS avgRating
    FROM Review R JOIN Reviewer RE ON R.reviewerID = RE.reviewerID
    WHERE RE.Name = '` + inputName + `'
    GROUP BY RE.Name
  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};

/* Reviews */
/* ---- (Reviews) ---- */
async function getLongestReviews(req, res) {
  var inputTitle = req.params.title;
  //var inputNum = req.params.num;
  var query = `
    SELECT * FROM(
    SELECT P.title, R.Overall AS rating, R.reviewText AS review, RE.Name AS reviewerName, R.time AS time
    FROM Review R JOIN Product P ON R.Asin = P.Asin JOIN Reviewer RE ON R.reviewerID = RE.reviewerID
    WHERE R.Asin IN (SELECT Asin
    FROM Product
    WHERE title = '${inputTitle}')
    ORDER BY R.time DESC, RE.Name) WHERE rownum <= 10
  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};



// The exported functions, which can be accessed in index.js.
module.exports = {
  getAllCategories: getAllCategories,
  getTopProductsInCategory: getTopProductsInCategory,
  getProductInfo: getProductInfo,
  getReviewerStats: getReviewerStats, getProductStats: getProductStats,
  getTopProductsInBrand: getTopProductsInBrand,
  getMostReviewedBrands: getMostReviewedBrands,
  getMostExpensiveProductsInBrand: getMostExpensiveProductsInBrand,
  getBrandStats: getBrandStats,
  getRelations: getRelations,
  getRelated: getRelated,
  getTopReviewers: getTopReviewers,
  getReviewerTime: getReviewerTime,
  getTopReviewsByReviewer: getTopReviewsByReviewer,
  getLongestReviews: getLongestReviews
}