import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { ProfileView } from "../profile-view/profile-view";

export const MainView = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      setFavorites(storedFavorites);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchMovies();
    }
  }, [token]);

  const fetchMovies = () => {
    fetch("https://mega-movies-5942d1a72620.herokuapp.com/movies", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const moviesFromApi = data.map((doc) => ({
          id: doc._id,
          title: doc.Title,
          image: doc.ImagePath,
          director: doc.Director?.Name,
          description: doc.Description,
        }));
        setMovies(moviesFromApi);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  };

  const handleUserUpdate = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setMovies([]);
    localStorage.clear();
  };

  const handleFavorite = (movieId) => {
    let updatedFavorites = [];

    if (favorites.includes(movieId)) {
      updatedFavorites = favorites.filter((id) => id !== movieId);
    } else {
      updatedFavorites = [...favorites, movieId];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // Filter the user's favorite movies
  const favoriteMovies = movies.filter((movie) =>
    favorites.includes(movie.id)
  );

  return (
    <Router>
      <NavigationBar user={user} onLoggedOut={handleLogout} />

      <Row className="justify-content-md-center">
        <Routes>
          <Route
            path="/login"
            element={
              !user ? (
                <Col md={5}>
                  <LoginView
                    onLoggedIn={(user, token) => {
                      setUser(user);
                      setToken(token);
                      localStorage.setItem("user", JSON.stringify(user));
                      localStorage.setItem("token", token);
                    }}
                  />
                </Col>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/signup"
            element={
              !user ? (
                <Col md={5}>
                  <SignupView />
                </Col>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/profile"
            element={
              !user ? (
                <Navigate to="/login" />
              ) : (
                <ProfileView
                  user={user}
                  movies={movies}
                  favorites={favoriteMovies} // Pass favorite movies here
                  onLoggedOut={handleLogout}
                  onUserUpdate={handleUserUpdate}
                />
              )
            }
          />
          <Route
            path="/movies/:movieId"
            element={<MovieDetail movies={movies} onFavorite={handleFavorite} />}
          />
          <Route
            path="/"
            element={
              !user ? (
                <Navigate to="/login" />
              ) : movies.length === 0 ? (
                <div>The list is empty!</div>
              ) : (
                <Row>
                  {movies.map((movie) => (
                    <Col className="mb-5" key={movie.id} md={3}>
                      <MovieCard movie={movie} onFavorite={handleFavorite} />
                    </Col>
                  ))}
                </Row>
              )
            }
          />
        </Routes>
      </Row>
    </Router>
  );
};

// MovieDetail Component to handle fetching movie details from URL
const MovieDetail = ({ movies, onFavorite }) => {
  const { movieId } = useParams();
  const movie = movies.find((m) => m.id === movieId);

  if (!movie) {
    return <div>Movie not found!</div>;
  }

  return (
    <Col md={9}>
      <MovieView movie={movie} onFavorite={onFavorite} />
    </Col>
  );
};
