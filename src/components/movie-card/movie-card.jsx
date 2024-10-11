import PropTypes from "prop-types";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export const MovieCard = ({ movie, onFavorite, onRemoveFavorite, isFavorite }) => {
  return (
    <Card className="h-100">
      <Card.Img variant="top" src={movie.image} alt={`${movie.title} poster`} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>Directed by: {movie.director}</Card.Text>
        <Link to={`/movies/${movie._id}`}>View Details</Link>
        <div className="mt-2">
          {isFavorite ? (
            <Button
              variant="danger"
              onClick={() => onRemoveFavorite(movie.title)} // Remove from favorites
            >
              Remove Favorite
            </Button>
          ) : (
            <Button variant="primary" onClick={() => onFavorite(movie.title)}>
              Add to Favorite
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

// PropTypes validation for MovieCard
MovieCard.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    director: PropTypes.string,
  }).isRequired,
  onFavorite: PropTypes.func.isRequired,
  onRemoveFavorite: PropTypes.func.isRequired, // Prop for removing a favorite
  isFavorite: PropTypes.bool.isRequired, // Boolean to check if the movie is a favorite
};
