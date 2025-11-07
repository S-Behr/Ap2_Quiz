import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import "../../App.css";

function Home() {
  return (
    <>
      <div className="wrapper">
        <h1>Quiz für Abschlussprüfung Teil 2</h1>
        <div className="btn-wrapper">
          <Button variant="outlined" component={Link} to="/Flashcards">
            Lernkarten
          </Button>
          <Button variant="outlined" component={Link} to="/apQuestions">
            AP2 Fragen
          </Button>
        </div>
      </div>
    </>
  );
}

export default Home;
