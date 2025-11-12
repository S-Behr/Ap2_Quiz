import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import "../../App.css";

function Home() {
  return (
    <>
      <div className="wrapper">
        <h1>Quiz für Abschlussprüfung Teil 2</h1>
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
                background: "linear-gradient(90deg, #ff7f7f, #ff4b4b)", // Gradient beim Hover
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
                background: "linear-gradient(90deg, #ff7f7f, #ff4b4b)",
                color: "#fff",
                boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                borderColor: "#ff4b4b",
              },
            }}
          >
            AP2 Fragen
          </Button>
        </div>
      </div>
    </>
  );
}

export default Home;
