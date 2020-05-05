
import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Login from './Login'
import Dashboard from './Dashboard';
import Reviews from './Reviews';
import Products from './Products';
import Reviewers from './Reviewers';
import ProductsStats from './ProductsStats'
import TopProductsBrand from './TopProductsBrand';
import MostReviewedBrands from './MostReviewedBrands'
import MostExpensiveProductinBrand from './MostExpensiveProductinBrand'
import RelatedProducts from './RelatedProducts'
import TopReviewers from './TopReviewers'
import TopReviewsByReviewer from './TopReviewsByReviewer'
import BrandStats from './BrandStats'
import ReviewerTime from './ReviewerTime'
import ProductsLabels from './ProductsLabels'



export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => (
								<Login />
							)}
						/>
						<Route
							exact
							path="/dashboard"
							render={() => (
								<Dashboard />
							)}
						/>
						<Route
							exact
							path="/Product stats"
							render={() => (
								<ProductsStats />
							)}
						/>

						<Route
							exact
							path="/Top products in a brand"
							render={() => (
								<TopProductsBrand />
							)}
						/>

						<Route
							exact
							path="/Most reviewed brands"
							render={() => (
								<MostReviewedBrands />
							)}
						/>

						<Route
							exact
							path="/Most expensive products per brand"
							render={() => (
								<MostExpensiveProductinBrand />
							)}
						/>

						<Route
							exact
							path="/Get related products"
							render={() => (
								<RelatedProducts />
							)}
						/>

						<Route
							exact
							path="/Get product labels"
							render={() => (
								<ProductsLabels />
							)}
						/>

						<Route
							exact
							path="/Get top reviewers"
							render={() => (
								<TopReviewers />
							)}
						/>

						<Route
							exact
							path="/Top products a reviewer has reviewed"
							render={() => (
								<TopReviewsByReviewer />
							)}
						/>
						<Route
							exact
							path="/Average rating and price in a brand"
							render={() => (
								<BrandStats />
							)}
						/>

						<Route
							exact
							path="/Get most recent reviews"
							render={() => (
								<ReviewerTime />
							)}
						/>

						<Route
							exact
							path="/reviews"
							render={() => (
								<Reviews />
							)}
						/>
						<Route
							path="/reviewers"
							render={() => (
								<Reviewers />
							)}
						/>
						<Route
							path="/products"
							render={() => (
								<Products />
							)}
						/>

					</Switch>
				</Router>
			</div>
		);
	}
}


/*
QUERIES LEFT:

 */
