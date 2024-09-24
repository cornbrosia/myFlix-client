import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { useState, useEffect } from "react";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { Row, Col, Button } from "react-bootstrap";

export const MainView = () => {
  // Get stored user and token from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");

  // Initialize state with values from localStorage (if available)
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Only fetch movies if the user is logged in (token exists)
  useEffect(() => {
    if (!token) {
      return;
    }

    fetch("https://mega-movies-5942d1a72620.herokuapp.com/movies", {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unauthorized");
        }
        return response.json();
      })
      .then((data) => {
        const moviesFromApi = data.map((doc) => ({
          id: doc._id,
          title: doc.Title,
          image: doc.ImagePath,
          director: doc.Director?.Name,
        }));
        setMovies(moviesFromApi);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, [token]);

  // Handle login and store user/token in localStorage
  const handleLogin = (user, token) => {
    console.log("*** handleLogin");
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  // Handle logout and clear localStorage
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setMovies([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // If the user is not logged in, show the login/signup views
  return (
    <Row>
      {!user ? (
        <Col md={5}>
          {/* Pass the handleLogin function to the LoginView */}
          <LoginView onLoggedIn={handleLogin} />
          or
          <SignupView />
        </Col>
      ) : selectedMovie ? (
        <Col md={9}>
          <MovieView
            movie={selectedMovie}
            onBackClick={() => setSelectedMovie(null)}
          />
        </Col>
      ) : movies.length === 0 ? (
        <div>The list is empty!</div>
      ) : (
        <>
          {/* Sign-out button appears here */}
          <Button onClick={handleLogout} variant="danger" className="mb-3">
            Sign Out
          </Button>

          <Row>
            {movies.map((movie) => (
              <Col className = "mb-5" key={movie.id} md={3}>
                <MovieCard
                  movie={movie}
                  onMovieClick={(newSelectedMovie) => {
                    setSelectedMovie(newSelectedMovie);
                  }}
                />
              </Col>
            ))}
          </Row>
        </>
      )}
    </Row>
  );
};
