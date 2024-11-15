import React from "react";
import PropTypes from "prop-types";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const MovieView = ({ movie, onBackClick, onFavorite }) => {
  const navigate = useNavigate();
  return (
    <Container className="movie-view mt-4">
      <Row>
        <Col md={4}>
          <div className="movie-poster">
            <img 
              src={movie.image} 
              alt={`${movie.title} poster`} 
              className="img-fluid" // Ensures the image is responsive
              style={{ maxHeight: "500px", objectFit: "cover" }} // Controls the image size
            />
          </div>
        </Col>
        <Col md={8}>
          <div className="movie-details">
            <h1>{movie.title}</h1>
            <p>Directed by: {movie.director}</p>
            <p>Summary: {movie.description}</p>
            <div className="mt-3">
            <Button variant="secondary" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button variant="primary" className="ms-2" onClick={() => onFavorite(movie.id)}>
                Favorite
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

MovieView.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    director: PropTypes.string,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onBackClick: PropTypes.func.isRequired,
  onFavorite: PropTypes.func.isRequired,  // Prop for favorite button
};
