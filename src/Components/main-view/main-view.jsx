import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { useState, useEffect } from "react";
import { LoginView } from "../login-view/login-view";
import {SignupView} from "../signup-view/signup-view";

export const MainView = () => {
  // Get stored user and token from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");

  // Initialize state with values from localStorage (if available)
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Fetch movies when token is available
  useEffect(() => {
    if (!token) return;

    fetch("https://mega-movies-5942d1a72620.herokuapp.com/movies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        const moviesFromApi = data.map((doc) => ({
          id: doc._id,
          title: doc?.Title,
          image: doc.ImagePath,
          director: doc.Director?.Name,
        }));
        setMovies(moviesFromApi);
      });
  }, [token]);

  // Handle login and store user/token in localStorage
  const handleLogin = (user, token) => {
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

  // If the user is not logged in, show the login view
  if (!user) {
    return (
      <>
        <LoginView onLoggedIn={(user, token) => {
          setUser(user);
          setToken(token);
        }} />
        <p>or</p>
        <SignupView />
      </>
    );
  }

  // If a movie is selected, show the MovieView
  if (selectedMovie) {
    return <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />;
  }

  // If no movies are available, show empty state
  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

  // Render the list of movies
  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onMovieClick={(newSelectedMovie) => setSelectedMovie(newSelectedMovie)}
        />
      ))}
    </div>
  );
};
