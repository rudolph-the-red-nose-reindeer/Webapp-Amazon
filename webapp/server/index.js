const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */




/* ---- (Dashboard) ---- */
app.get('/categories', routes.getAllCategories);
app.get('/categories/:category', routes.getTopProductsInCategory);
//app.get('/categories/:category', routes.getCheapestReviewedProductsInCategory);
//app.get('/categories/:category', routes.getMostExpensiveReviewedProductsInCategory);
//app.get('/categories/:category', routes.getMostReviewedProductsInCategory);
/* ---- (Reviews) ---- */
//app.get('/reviews', routes.getLongestReviews);

/* ---- (Products) ---- */
app.get('/products/:product', routes.getProductInfo);
app.get('/Product%20stats/:product', routes.getProductStats);
app.get('/Top%20products%20in%20a%20brand/:brand', routes.getTopProductsInBrand);
app.get('/Most%20reviewed%20brands/', routes.getMostReviewedBrands);
app.get('/Most%20expensive%20products%20per%20brand/:brand', routes.getMostExpensiveProductsInBrand);
app.get('/Average%20rating%20and%20price%20in%20a%20brand/:brand', routes.getBrandStats);
app.get('/Get%20product%20labels', routes.getRelations);
app.get('/Get%20related%20products/:title/:relation', routes.getRelated);

/* ---- (Reviewers) ---- */
//app.get('/reviewers', routes.getTopReviewers);
app.get('/reviewers/:reviewer', routes.getReviewerStats);
app.get('/Get%20top%20reviewers', routes.getTopReviewers);
app.get('/Get%20most%20recent%20reviews/:reviewer', routes.getReviewerTime);
app.get('/Top%20products%20a%20reviewer%20has%20reviewed/:reviewer', routes.getTopReviewsByReviewer);

/* ---- (Reviews) ---- */
app.get('/reviews/:title', routes.getLongestReviews);
app.get('/Get%20products%20with%20no%20review', routes.getUnreviewedProducts);
//app.get('/reviews', routes.getNewestReviews);

app.get('/products/:info', routes.getProductInfo);
//need to change reccomendations... to productinfo




app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
