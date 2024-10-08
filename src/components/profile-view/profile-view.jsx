import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MovieCard } from "../movie-card/movie-card"; // Import your MovieCard component

export const ProfileView = ({ user, movies, onLoggedOut, onUserUpdate }) => {
  const [updatedUser, setUpdatedUser] = useState({
    username: user?.Username || "",
    password: "",
    email: user?.Email || "",
    birthday: user?.Birthday || "",
  });

  const navigate = useNavigate();

  // If user is not defined, show a loading message or handle it safely
  if (!user) {
    return <div>Loading...</div>; // Prevents the component from breaking if user is undefined
  }

  // Handle input change for the update form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  // Handle updating user information
  const handleUpdate = (e) => {
    e.preventDefault();

    fetch(`https://mega-movies-5942d1a72620.herokuapp.com/users/${user.Username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to update user");
        }
      })
      .then((updatedData) => {
        onUserUpdate(updatedData); // Pass the updated user back to the parent
        alert("User updated successfully");
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  // Handle user deregistration
  const handleDeregister = () => {
    fetch(`https://mega-movies-5942d1a72620.herokuapp.com/users/${user.Username}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          onLoggedOut(); // Call onLoggedOut to reset app state
          localStorage.clear();
          navigate("/login"); // Redirect to login after deregistration
        } else {
          throw new Error("Failed to delete user");
        }
      })
      .catch((error) => {
        console.error("Error deregistering user:", error);
      });
  };

  // Filter user's favorite movies
  const favoriteMovies = movies.filter((m) => user.FavoriteMovies.includes(m.title));

  return (
    <div className="profile-view">
      <h2>Profile Information</h2>
      <form onSubmit={handleUpdate}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={updatedUser.username}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={updatedUser.password}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={updatedUser.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Birthday:
          <input
            type="date"
            name="birthday"
            value={updatedUser.birthday}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Update Information</button>
      </form>

      <button onClick={handleDeregister} className="deregister-button">
        Deregister
      </button>

      <h2>Favorite Movies</h2>
      {favoriteMovies.length > 0 ? (
        <div className="favorite-movies">
          {favoriteMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      ) : (
        <p>No favorite movies yet.</p>
      )}
    </div>
  );
};
