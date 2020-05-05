import React from 'react';
import PageNavbar from './PageNavbar';
import TopReviewsByReviewerRow from './TopReviewsByReviewerRow';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown1 from './Dropdown1';



export default class TopReviewsByReviewer extends React.Component {

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

	/* ---- Q2 (Recommendations) ---- */
	// Hint: Name of movie submitted is contained in `this.state.movieName`.
	submitProduct() {
		// Send an HTTP request to the server.
    fetch("http://localhost:8081/Top%20products%20a%20reviewer%20has%20reviewed/"+ this.state.productName,
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
			<td>{recObj.PRODUCTNAME}</td>
			<td>{recObj.RATING}</td>
			<td>{recObj.REVIEW}</td>
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
			<div className="Reviewers">
				<PageNavbar active="reviewers" />

			    <div className="container products-container">
			    	<div className="jumbotron">
			    		<div className="h5">Search for the top rated reviews by reviewer</div>
			    		<br></br>
			    		<div className="input-container">
			    			<input type='text' placeholder="Enter name" value={this.state.productName} onChange={this.handleProductNameChange} id="productName" className="topreviewsbyreviewer-input"/>
			    			<button id="submitMovieBtn" className="submit-btn" onClick={this.submitProduct}>Submit</button>
								</div>
								<div class="container">
						<div className="h6">Or <Dropdown1 title="Other reviewer information" /></div>
						<table class="table table-striped">
							<thead>
							<tr>
								<th>Product Name</th>
								<th>Rating</th>
								<th>Review</th>
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
