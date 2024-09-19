import { useState } from "react";

export const SignupView = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form from refreshing
  
    const data = {
      Username: username,   // Capitalized to match the database
      Password: password,   // Capitalized to match the database
      Email: email,         // Capitalized to match the database
      Birthday: birthday    // Capitalized to match the database
    };
  
    fetch("https://mega-movies-5942d1a72620.herokuapp.com/users", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        console.log("Response status:", response.status); // Log response status
  
        // Try to parse the response as JSON, but also return raw response in case of parsing failure
        return response.json().catch(() => {
          console.error("Response could not be parsed as JSON:", response);
          return { error: "Could not parse server response" };
        }).then((data) => ({ data, status: response.status }));
      })
      .then(({ data, status }) => {
        console.log("Response data:", data); // Log response data
        if (status === 200 || status === 201) {  // Check for 200/201 status
          alert("Signup successful");
          window.location.reload(); // Refresh the page after successful signup
        } else {
          console.error("Signup failed with status:", status, "Data:", data);
          alert("Signup failed: " + (data.error || "Unknown error"));
        }
      })
      .catch((error) => {
        console.error("Error during signup:", error); // Log error details
        alert("Signup failed: " + error.message);
      });
  };
  
  
  

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength="3"
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Birthday:
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          required
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};
