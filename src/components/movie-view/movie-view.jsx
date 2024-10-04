import React from 'react';
import "./movie-view.scss";
import { Link } from "react-router-dom";

export const MovieView = ({ movie, onBackClick }) => {
  if (!movie) return null; // If no movie is selected, don't render

  return (
    <div className="movie-view">
      <div>
        <img className="w-100" src={movie.image} alt={`${movie.title} poster`} />
      </div>
      <div>
        <span>Title: </span>
        <span>{movie.title}</span>
      </div>
      <div>
        <span>Director: </span>
        <span>{movie.director}</span>
      </div>
      <button onClick={onBackClick} className="back-button">
        Back
      </button>
    </div>
  );
};
