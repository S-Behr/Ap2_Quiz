import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import "../../App.css";

function Home() {
  return (
    <>
      <div className="wrapper">
        <h1>Quiz für Abschlussprüfung Teil 2</h1>
        <Typography
          variant="body1"
          component="p"
          gutterBottom
          sx={{
            fontWeight: 500,
            color: "#81d4fa",
            mt: 3,
            textAlign: "center",
            width: { xs: "90%", sm: "70%", md: "50%" },
            backgroundColor: "rgba(33, 33, 50, 0.7)",
            padding: "20px 25px",
            borderRadius: "12px",
            boxShadow: "0 0 15px rgba(77, 208, 225, 0.2)",
            border: "1px solid rgba(77, 208, 225, 0.3)",
          }}
        >
          Willkommen im Prüfungsbereich AP 2. Bereiten Sie sich auf Ihre
          Abschlussprüfung Teil 2 vor, indem Sie unser Wissenstraining nutzen.
          Wählen Sie zwischen Lernkarten zum schnellen Erfassen von Inhalten,
          dem flexiblen Übungsquiz mit sofortigem Feedback oder der
          realistischen Prüfungssimulation mit Zeitlimit.
        </Typography>
        <div className="btn-wrapper">
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/Flashcards"
            sx={{
              borderColor: "#ff4b4b",
              color: "#ff4b4b",
              borderRadius: "8px",
              padding: "10px 20px",
              fontWeight: 500,
              textTransform: "none",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(90deg, #fa2828ff, #ce4141ff)",
                color: "#fff",
                boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                borderColor: "#ff4b4b",
              },
            }}
          >
            Lernkarten
          </Button>

          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/apQuestions"
            sx={{
              borderColor: "#ff4b4b",
              color: "#ff4b4b",
              borderRadius: "8px",
              padding: "10px 20px",
              fontWeight: 500,
              textTransform: "none",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(90deg, #fa2828ff, #ce4141ff)",
                color: "#fff",
                boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                borderColor: "#ff4b4b",
              },
            }}
          >
            Quizze
          </Button>
        </div>
      </div>
    </>
  );
}

export default Home;
