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
            },
          }}
        >
          Übe dein Wissen
        </Button>

        <Button
          variant="contained"
          size="large"
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
            },
          }}
        >
          Teste dein Wissen!
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
