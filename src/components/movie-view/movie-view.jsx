import React from 'react';
import "./movie-view.scss";
export const MovieView = ({ movie, onBackClick }) => {
  return (
    <div>
      <div>
        <img src={movie.image} alt={`${movie.title} poster`} />
      </div>
      <div>
        <span>Title: </span>
        <span>{movie.title}</span>
      </div>
      <div>
        <span>Director: </span>
        <span>{movie.director}</span>
      </div>
      <button onClick={onBackClick} className = "back-button"  
        style={{ cursor: "pointer" }}
      >Back</button>
    </div>
  );
};