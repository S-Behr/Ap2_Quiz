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
        background: "linear-gradient(145deg, #ffecd2, #fcb69f)",
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 700,
          background: "linear-gradient(90deg, #ff6a88, #ff99ac)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 4,
        }}
      >
        AP 2 Fragen
      </Typography>
      <Typography
        variant="body1"
        component="p"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: "#ff6a88",
          mb: 4,
          textAlign: "center",
          width: { xs: "50%", md: "40%" },
          backgroundColor: "rgba(255, 106, 136, 0.1)",
          padding: "15px 20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
            background: "linear-gradient(90deg, #ff7f7f, #ff4b4b)",
            color: "#fff",
            borderRadius: "8px",
            padding: "12px 24px",
            fontWeight: 500,
            textTransform: "none",
            boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(90deg, #ff4b4b, #ff1f1f)",
              boxShadow: "0 8px 22px rgba(0,0,0,0.2)",
              color: "#fff",
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
            background: "linear-gradient(90deg, #ff7f7f, #ff4b4b)",
            color: "#fff",
            borderRadius: "8px",
            padding: "12px 24px",
            fontWeight: 500,
            textTransform: "none",
            boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(90deg, #ff4b4b, #ff1f1f)",
              boxShadow: "0 8px 22px rgba(0,0,0,0.2)",
              color: "#fff",
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
          background: "linear-gradient(90deg, #ff7f7f, #ff4b4b)",
          color: "#fff",
          borderRadius: "8px",
          padding: "12px 24px",
          marginTop: "2rem",
          fontWeight: 500,
          textTransform: "none",
          boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
          transition: "all 0.3s ease",
          "&:hover": {
            background: "linear-gradient(90deg, #ff4b4b, #ff1f1f)",
            boxShadow: "0 8px 22px rgba(0,0,0,0.2)",
            color: "#fff",
          },
        }}
      >
        zurück zur Startseite
      </Button>
    </Box>
  );
};

export default ApQuestions;
