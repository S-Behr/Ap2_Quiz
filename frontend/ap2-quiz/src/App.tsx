import React from "react";
import "./App.css";
import Flashcards from "./pages/Flashcards/Flashcards";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import ApQuestions from "./pages/APQuestion/ApQuestions";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/apQuestions" element={<ApQuestions />} />
      </Routes>
    </>
  );
}

export default App;
