import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

const ApQuestions: React.FC = () => {
  return (
    <Box
      className="ap-questions-container"
      sx={{
        textAlign: "center",
        padding: 4,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(circle at top left, #1a0033 0%, #0d001a 50%, #05000f 100%)",
        color: "#e0f7fa",
        fontFamily: "'Orbitron', sans-serif",
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 700,
          background: "linear-gradient(90deg, #4dd0e1, #81d4fa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 4,
          textShadow: "0 0 10px rgba(77, 208, 225, 0.5)",
          letterSpacing: 2,
        }}
      >
        AP 2 Fragen
      </Typography>
      <Typography
        variant="body1"
        component="p"
        gutterBottom
        sx={{
          fontWeight: 500,
          color: "#81d4fa",
          mb: 5,
          textAlign: "center",
          width: { xs: "90%", sm: "70%", md: "50%" },
          backgroundColor: "rgba(33, 33, 50, 0.7)",
          padding: "20px 25px",
          borderRadius: "12px",
          boxShadow: "0 0 15px rgba(77, 208, 225, 0.2)",
          border: "1px solid rgba(77, 208, 225, 0.3)",
        }}
      >
        Willkommen im Prüfungsbereich AP 2. Hier können Sie sich gezielt auf
        Ihre Abschlussprüfung Teil 2 vorbereiten. Wählen Sie zwischen dem
        flexiblen Übungsmodus mit sofortigem Feedback oder der realistischen
        Prüfungssimulation mit Zeitlimit.
      </Typography>

      <Box
        className="button-group"
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/practiceQuiz"
          sx={{
            background: "linear-gradient(90deg, #4dd0e1, #81d4fa)",
            color: "#0d001a",
            borderRadius: "6px",
            padding: "12px 25px",
            fontWeight: 600,
            textTransform: "uppercase",
            boxShadow: "0 0 10px rgba(77, 208, 225, 0.5)",
            transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
            "&:hover": {
              background: "linear-gradient(90deg, #81d4fa, #4dd0e1)",
              boxShadow:
                "0 0 20px rgba(77, 208, 225, 0.8), 0 4px 15px rgba(0, 0, 0, 0.4)",
              transform: "translateY(-2px)",
              color: "#0d001a",
            },
          }}
        >
          Starte das Übungsquiz
        </Button>

        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/examQuiz"
          sx={{
            background: "linear-gradient(90deg, #4dd0e1, #81d4fa)",
            color: "#0d001a",
            borderRadius: "6px",
            padding: "12px 25px",
            fontWeight: 600,
            textTransform: "uppercase",
            boxShadow: "0 0 10px rgba(77, 208, 225, 0.5)",
            transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
            "&:hover": {
              background: "linear-gradient(90deg, #81d4fa, #4dd0e1)",
              boxShadow:
                "0 0 20px rgba(77, 208, 225, 0.8), 0 4px 15px rgba(0, 0, 0, 0.4)",
              transform: "translateY(-2px)",
              color: "#0d001a",
            },
          }}
        >
          Starte das Examensquiz
        </Button>
      </Box>

      <Button
        variant="contained"
        size="large"
        component={Link}
        to="/"
        sx={{
          borderColor: "#ff4b4b",
          color: "#fff",
          borderRadius: "6px",
          padding: "12px 25px",
          marginTop: "3rem",
          fontWeight: 600,
          textTransform: "uppercase",
          boxShadow: "0 0 8px rgba(0, 188, 212, 0.4)",
          transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
          "&:hover": {
            background: "linear-gradient(90deg, #fa2828ff, #ce4141ff)",
            boxShadow:
              "0 0 15px rgba(0, 188, 212, 0.7), 0 4px 10px rgba(0, 0, 0, 0.3)",
            transform: "translateY(-2px)",
            color: "#05000f",
          },
        }}
      >
        zurück zur Startseite
      </Button>
    </Box>
  );
};

export default ApQuestions;
