import React from 'react';
import PageNavbar from './PageNavbar';
import RecommendationsRow from './RecommendationsRow';
import './App.scss';
import Dropdown from './Dropdown';
//import ProductsRows from './ProductsRows';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';



export default class Products extends React.Component {

	constructor(props) {

		super(props);



		// State maintained by this React component is the selected movie name,
		// and the list of recommended movies.
		this.state = {
			productName: "",
			productAttrs: []
		}

		this.handleProductNameChange = this.handleProductNameChange.bind(this);
		this.submitProduct = this.submitProduct.bind(this);
	}

	handleProductNameChange(e) {
		this.setState({
			productName: e.target.value
		});
	}

	
	// Submit product functionality
	submitProduct() {
		// Send an HTTP request to the server.
    fetch("http://localhost:8081/products/"+ this.state.productName,
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(recList => {
      if (!recList) return;

      // Map each genreObj in genreList to an HTML element:
      // A button which triggers the showMovies function for each genre.
      let recDivs = recList.map((recObj, i) =>
      	<tr>
			<td>{recObj.DESCRIPTION}</td>
			<td>{recObj.BRAND}</td>
	  	</tr> 
      );



      // Set the state of the genres list to the value returned by the HTTP response from the server.
      this.setState({
        productAttrs: recDivs
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
	}


	render() {

		return (
			<div className="Products">
				<PageNavbar active="products" />

			    <div className="container products-container">
			    	<div className="jumbotron">
			    		<div className="h5">Product search</div>
			    		<br></br>
			    		<div className="input-container">
			    			<input type='text' placeholder="Enter product name" value={this.state.productName} onChange={this.handleProductNameChange} id="productName" className="product-input"/>
			    			<button id="submitMovieBtn" className="submit-btn" onClick={this.submitProduct}>Submit</button>
			    		</div>
						
			    		
						<div class="container">
						<div className="h6">Or <Dropdown title="Other product information" />
							</div>
							<table class="table table-striped">
								<thead>
								<tr>
									<th>Description</th>
									<th>Brand</th>
								</tr>
								</thead>
								<tbody>
									{this.state.productAttrs}
								</tbody>
							</table>
			    		</div>
					</div>
				</div>
			</div>

		);
	}
}
