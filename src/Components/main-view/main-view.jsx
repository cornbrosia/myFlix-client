import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { useState, useEffect } from "react";
import { LoginView } from "../login-view/login-view";

export const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [token, setToken] = useState(null);

  if (!user) {
    return (
      <LoginView
        onLoggedIn={(user, token) => {
          setUser(user);
          setToken(token);
        }}
      />
    );
  }
  useEffect(() => {
    if (!token){
      return;
    }
    fetch("https://mega-movies-5942d1a72620.herokuapp.com/movies",{
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((data) => {
        const moviesFromApi = data.map((doc) => {
          return {
            id: doc._id,
            title: doc?.Title,
            image:
            doc.ImagePath,
            director: doc.Director?.Name
          };
        });

        setMovies(moviesFromApi);
      });
  }, []);

 

  const handleBackClick = () => {
    setSelectedMovie(null); // Reset to original state to show MainView again
  };
  <button onClick={() => { setUser(null); setToken(null); }}>Logout</button>

  if (!user) {
    return <LoginView />;
  }
  if (selectedMovie) {
    return <MovieView movie={selectedMovie} onBackClick={handleBackClick} />;
  }
  if (!user) {
    return <LoginView onLoggedIn={(user) => setUser(user)} />;
  }
  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

  return (
    <div>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onMovieClick={(newSelectedMovie) => {
            setSelectedMovie(newSelectedMovie);
          }}
        />
      ))}
    </div>
  );
};







