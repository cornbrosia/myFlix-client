import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { ProfileView } from "../profile-view/profile-view";

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");

  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null); // State for selected movie

  // Fetch movies when the token is available (user is logged in)
  useEffect(() => {
    if (!token) return;

    fetch("https://mega-movies-5942d1a72620.herokuapp.com/movies", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Fixed the Authorization header
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Unauthorized");
        return response.json();
      })
      .then((data) => {
        const moviesFromApi = data.map((doc) => ({
          id: doc._id,
          title: doc.Title,
          image: doc.ImagePath,
          director: doc.Director?.Name,
        }));
        setMovies(moviesFromApi); // Store movies in state
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, [token]);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setMovies([]);
    localStorage.clear();
  };

  return (
    <Router>
      <NavigationBar user={user} onLoggedOut={handleLogout} /> {/* Pass props */}

      <Row className="justify-content-md-center">
        <Routes>
          <Route
            path="/login"
            element={
              !user ? (
                <Col md={5}>
                  <LoginView onLoggedIn={(user) => setUser(user)} />
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
                <ProfileView user={user} movies={movies} onLoggedOut={handleLogout} />
              )
            }
          />
          <Route
            path="/"
            element={
              !user ? (
                <Navigate to="/login" />
              ) : selectedMovie ? ( // Show movie details if a movie is selected
                <Col md={9}>
                  <MovieView
                    movie={selectedMovie} // Pass selected movie directly to MovieView
                    onBackClick={() => setSelectedMovie(null)} // Reset selected movie
                  />
                </Col>
              ) : movies.length === 0 ? (
                <div>The list is empty!</div>
              ) : (
                <>
                  <Button onClick={handleLogout} variant="danger" className="mb-3">
                    Sign Out
                  </Button>
                  <Row>
                    {movies.map((movie) => (
                      <Col className="mb-5" key={movie.id} md={3}>
                        <MovieCard
                          movie={movie}
                          onMovieClick={(newSelectedMovie) => {
                            setSelectedMovie(newSelectedMovie); // Set selected movie
                          }}
                        />
                      </Col>
                    ))}
                  </Row>
                </>
              )
            }
          />
        </Routes>
      </Row>
    </Router>
  );
};
