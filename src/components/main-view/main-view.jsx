import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { NavigationBar } from "../navigation-bar/navigation-bar.jsx";
import { MovieCard } from "../movie-card/movie-card.jsx";
import { MovieView } from "../movie-view/movie-view.jsx";
import { LoginView } from "../login-view/login-view.jsx";
import { SignupView } from "../signup-view/signup-view.jsx";
import { ProfileView } from "../profile-view/profile-view.jsx";
import { useNavigate } from "react-router-dom";

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

  const handleFavorite = (movieTitle) => {
    console.log("Selected Movie Title:", movieTitle); // Log to confirm movie title
    const favoriteMovies = user.FavoriteMovies || []; // Use user's existing favorites

    // Check if the movie is already in the favorites list
    if (favoriteMovies.includes(movieTitle) ) {
      alert("Movie is already in favorites.");
      console.log("Movie already in favorites:", movieTitle);
      return;
    }

    // Add the movie to the user's FavoriteMovies list
    const newFavorites = [...favoriteMovies, movieTitle];
    console.log("Updated Favorite Movies List:", newFavorites);

    // Update the user in the backend
    fetch(`https://mega-movies-5942d1a72620.herokuapp.com/users/${user.Username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Use the token for authorization
      },
      body: JSON.stringify({ ...user, FavoriteMovies: newFavorites }),
    })
      .then((response) => {
        console.log("Backend response status:", response.status);
        return response.json();
      })
      .then((updatedUserData) => {
        console.log("Updated user data from backend:", updatedUserData);
        // setUser(updatedUserData); // Update the local user state
        handleUserUpdate(updatedUserData)
        alert("Movie added to favorites!");
      })
      .catch((error) => {
        console.error("Error updating user favorites:", error); // Log any error
      });
  };
  const handleRemoveFavorite = (movieTitle) => {
    const favoriteMovies = user.FavoriteMovies || [];

    if (!favoriteMovies.includes(movieTitle)) {
      alert("Movie is not in favorites.");
      return;
    }

    const newFavorites = favoriteMovies.filter((title) => title !== movieTitle);

    fetch(`https://mega-movies-5942d1a72620.herokuapp.com/users/${user.Username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...user, FavoriteMovies: newFavorites }),
    })
      .then((response) => response.json())
      .then((updatedUserData) => {
        // setUser(updatedUserData);
        handleUserUpdate(updatedUserData)
        setFavorites(newFavorites);
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
        alert("Movie removed from favorites!");
      })
      .catch((error) => {
        console.error("Error removing movie from favorites:", error);
      });
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
                  onFavorite={handleFavorite} 
                  onRemoveFavorite={handleRemoveFavorite}
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
                      <MovieCard movie={movie} 
                      onFavorite={handleFavorite} 
                      onRemoveFavorite={handleRemoveFavorite}
                      isFavorite={favorites.includes(movie._id)} />
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
  const handleBackClick = () => {
    navigate(-1); // This will go back to the previous page in history
  };
  return (
    <Col md={9}>
      <MovieView movie={movie}
       onFavorite={onFavorite}
      onBackClick={handleBackClick} />
    </Col>
  );
};
