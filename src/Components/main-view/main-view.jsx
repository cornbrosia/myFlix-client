import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: "Superbad",
      image:
        "https://th.bing.com/th/id/OIP.eSGMaw1CsCp6O0j3eWnfEwHaEK?rs=1&pid=ImgDetMain",
      director: "Judd Apatow"
    },
    {
      id: 2,
      title: "Jurassic Park",
      image:
        "https://th.bing.com/th/id/R.43c822ade1bde86a848814525645d773?rik=4q8SP8PlkvBtvg&riu=http%3a%2f%2fimg3.wikia.nocookie.net%2f__cb20141018180224%2fdinosaurs%2fimages%2f2%2f20%2fJurassic-Park-Logo.jpg&ehk=CNFsAUYLjV8WZ8CWDDD20x%2bK4TC5Z4l1UN%2bukUYerdU%3d&risl=&pid=ImgRaw&r=0",
      director: "Steven Spielberg"
    },
    {
      id: 3,
      title: "Arrival",
      image:
        "https://th.bing.com/th/id/R.28b57cbca36bb552a2fc173dc237d135?rik=xUHxzAOIHtY%2fSw&pid=ImgRaw&r=0",
      director: "Denis Villeneuve"
    },
  ]);

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







