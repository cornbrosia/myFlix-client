import PropTypes from "prop-types";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export const MovieCard = ({ movie, onFavorite }) => {
  return (
    <Card className="h-100">
      <Card.Img variant="top" src={movie.image} alt={`${movie.title} poster`} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>Directed by: {movie.director}</Card.Text>
        <Link to={`/movies/${movie._id}`}>View Details</Link>
        <Button variant="primary" className="mt-2" onClick={() => onFavorite(movie._id)}>
          Favorite
        </Button>
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
  onFavorite: PropTypes.func.isRequired, // Function to handle favoriting a movie
};
