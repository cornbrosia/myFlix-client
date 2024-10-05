import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export const MovieCard = ({ movie }) => {
  return (
    <Card className="h-100">
      <Card.Img variant="top" src={movie.image} alt={`${movie.title} poster`} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>Directed by: {movie.director}</Card.Text>
        <Link to={`/movies/${movie.id}`}> {/* Use a dynamic route */}
          View Details
        </Link>
      </Card.Body>
    </Card>
  );
};

// PropTypes validation for MovieCard
MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    director: PropTypes.string,
  }).isRequired,
};
