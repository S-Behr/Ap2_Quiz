import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import "../../App.css";

function Home() {
  return (
    <>
      <div className="wrapper">
        <h1 className="main-heading">Quiz für Abschlussprüfung Teil 2</h1>
        <Typography
          variant="body1"
          component="p"
          gutterBottom
          className="home-description-box"
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
            className="home-nav-btn flashcards-btn"
          >
            zu den Lernkarten
          </Button>

          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/apQuestions"
            className="home-nav-btn quiz-select-btn"
          >
            zu den Quizzen
          </Button>
        </div>
      </div>
    </>
  );
}

export default Home;
