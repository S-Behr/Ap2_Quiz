import React from "react";
import "./App.css";
import Flashcards from "./pages/Flashcards/Flashcards";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import ApQuestions from "./pages/APQuestion/ApQuestions";
import ExamQuiz from "./pages/APQuestion/ExamQuiz";
import PracticeQuiz from "./pages/APQuestion/PracticeQuiz";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/apQuestions" element={<ApQuestions />} />
        <Route path="/practiceQuiz" element={<PracticeQuiz />} />
        <Route path="/examQuiz" element={<ExamQuiz />} />
      </Routes>
    </>
  );
}

export default App;
