import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { useState, useEffect } from "react";

export const MainView = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("https://my-flix-site-1e2e2d6bc417.herokuapp.com/movies")
      .then((response) => response.json())
      .then((data) => {
        const booksFromApi = data.docs.map((doc) => {
          return {
            id: doc.key,
            title: doc.title,
            image:
            `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`,
            director: doc.author_name?.[0]
          };
        });

        setMovies(booksFromApi);
      });
  }, []);

  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleBackClick = () => {
    setSelectedMovie(null); // Reset to original state to show MainView again
  };

  if (selectedMovie) {
    return <MovieView movie={selectedMovie} onBackClick={handleBackClick} />;
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







