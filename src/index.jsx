// import React from 'react';
import { createRoot } from 'react-dom/client';
import Container from 'react-bootstrap/Container';
import { MainView } from './components/main-view/main-view';
// Import statement to indicate that you need to bundle `./index.scss`
import "./index.scss";
import 'bootstrap/dist/css/bootstrap.min.css';

// Main component (will eventually use all the others)
const App = () => {
  return (
    <Container style={{border: "1px solid red"}}>
      <MainView />
    </Container>
  );
 };

// Finds the root of your app
const container = document.querySelector("#root");
const root = createRoot(container);

// Tells React to render your app in the root DOM element
root.render(<App/>);