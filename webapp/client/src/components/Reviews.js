import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/Reviews.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown2 from './Dropdown2';

export default class Reviews extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected name,
		// and the list of recommended movies.
		this.state = {
			movieName: "",
			recMovies: []
		}

		this.handleMovieNameChange = this.handleMovieNameChange.bind(this);
		this.submitMovie = this.submitMovie.bind(this);
	}

	handleMovieNameChange(e) {
		this.setState({
			movieName: e.target.value
		});
	}

	/* ---- Q2 (Recommendations) ---- */
	// Hint: Name of movie submitted is contained in `this.state.movieName`.
	submitMovie() {
		// Send an HTTP request to the server.
    fetch("http://localhost:8081/reviews/"+ this.state.movieName,
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
		<td>{recObj.REVIEWERNAME}</td>
        <td>{recObj.RATING}</td>
        <td>{recObj.REVIEW}</td> 
      </tr>

      );



      // Set the state of the genres list to the value returned by the HTTP response from the server.
      this.setState({
        recMovies: recDivs
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
	}


	render() {

		return (

			<div className="Reviews">
				<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"></link>
  				<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  				<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>

				<PageNavbar active="reviews" />

			    <div className="container recommendations-container">
			    	<div className="jumbotron">
			    		<div className="h5">Review Search</div>
			    		<br></br>
			    		<div className="input-container">
			    			<input type='text' placeholder="Enter Product Name" value={this.state.movieName} onChange={this.handleMovieNameChange} id="movieName" className="movie-input"/>
			    			<button id="submitMovieBtn" className="submit-btn" onClick={this.submitMovie}>Submit</button>
			    		</div>
			    		<div class="container">
						<h2>These are the best reviews</h2>
						<div className="h6">Or <Dropdown2 title="Other review information" /> </div>
						<table class="table table-striped">
							<thead>
							<tr>
								<th>Name</th>
								<th>Rating</th>
								<th>Review</th>
							</tr>
							</thead>
							<tbody>
								{this.state.recMovies}
							</tbody>
						</table>
			    		</div>
			    	</div>
		    	</div>
			</div>
		);
	}
}
