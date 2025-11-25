import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import "./apQuestion.css";

const ApQuestions: React.FC = () => {
  return (
    <Box className="ap-questions-container">
      <Typography variant="h3" component="h1" gutterBottom className="ap-title">
        AP 2 Fragen
      </Typography>
      <Typography
        variant="body1"
        component="p"
        gutterBottom
        className="ap-description"
      >
        Willkommen im Prüfungsbereich AP 2. Hier können Sie sich gezielt auf
        Ihre Abschlussprüfung Teil 2 vorbereiten. Wählen Sie zwischen dem
        flexiblen Übungsmodus mit sofortigem Feedback oder der realistischen
        Prüfungssimulation mit Zeitlimit.
      </Typography>

      <Box className="button-group">
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/practiceQuiz"
          className="ap-quiz-btn ap-primary-btn"
        >
          Starte das Übungsquiz
        </Button>

        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/examQuiz"
          className="ap-quiz-btn ap-primary-btn"
        >
          Starte das Examensquiz
        </Button>
      </Box>

      <Button
        variant="contained"
        size="large"
        component={Link}
        to="/"
        className="ap-quiz-btn ap-back-btn"
      >
        zurück zur Startseite
      </Button>
    </Box>
  );
};

export default ApQuestions;
