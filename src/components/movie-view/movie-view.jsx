import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

export const MovieView = ({ movie, onBackClick, onFavorite }) => {
  return (
    <div className="movie-view">
      <div className="movie-poster">
        <img src={movie.image} alt={`${movie.title} poster`} />
      </div>
      <div className="movie-details">
        <h1>{movie.title}</h1>
        <p>Directed by: {movie.director}</p>
        <p>Summary: {movie.description}</p>
        <Button onClick={onBackClick}>Back</Button>
        <Button variant="primary" className="mt-2" onClick={() => onFavorite(movie.id)}>
          Favorite
        </Button>
      </div>
    </div>
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
