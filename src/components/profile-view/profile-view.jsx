import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MovieCard } from "../movie-card/movie-card.jsx";
import { Row, Col, Form, Button } from "react-bootstrap"; // Import Bootstrap components

export const ProfileView = ({ user, movies, onLoggedOut, onUserUpdate, onRemoveFavorite }) => {
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

  // Handle updating user information with the API call
  const handleUpdate = (e) => {
    e.preventDefault();

    // API call to update user information
    fetch(`https://mega-movies-5942d1a72620.herokuapp.com/users/${user.Username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        Username: updatedUser.username,
        Password: updatedUser.password,
        Email: updatedUser.email,
        Birthday: updatedUser.birthday,
      }),
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
    <div className="profile-view container">
      <h2 className="my-4">Profile Information</h2>
      <Form onSubmit={handleUpdate}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={updatedUser.username}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={updatedUser.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={updatedUser.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formBirthday" className="mb-3">
              <Form.Label>Birthday:</Form.Label>
              <Form.Control
                type="date"
                name="birthday"
                value={updatedUser.birthday}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" className="me-2">
          Update Information
        </Button>
        <Button variant="danger" onClick={handleDeregister}>
          Deregister
        </Button>
      </Form>

      <h2 className="my-4">Favorite Movies</h2>
      {favoriteMovies.length > 0 ? (
        <Row className="favorite-movies">
          {favoriteMovies.map((movie) => (
            <Col md={4} key={movie._id} className="mb-3">
              <MovieCard
                movie={movie}
                isFavorite
                onRemoveFavorite={onRemoveFavorite}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <p>No favorite movies yet.</p>
      )}
    </div>
  );
};
