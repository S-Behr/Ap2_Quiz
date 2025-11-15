import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Checkbox,
  Radio,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./quiz.css";

interface FrageMitAntworten {
  id: number;
  text: string;
  type: "single" | "multiple";
  answers: {
    id: number;
    text: string;
    isCorrect: boolean;
  }[];
}

interface Fragenart {
  FragenartID: number;
  Art: "Singlechoise" | "Multiplechoise";
}

interface Antwortmoeglichkeit {
  AntwortID: number;
  QuizFrageID: number;
  AntwortenText: string;
  IstRichtig: boolean;
}

interface Quizfrage {
  FrageID: number;
  ArtID: number;
  FragenText: string;
  Bild?: string | null;
}

const PracticeQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<FrageMitAntworten[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizData = async () => {
      const [fragenRes, antwortenRes, artenRes] = await Promise.all([
        fetch("http://localhost:3000/Quizfragen"),
        fetch("http://localhost:3000/Antwortmoeglichkeiten"),
        fetch("http://localhost:3000/Fragenart"),
      ]);

      const [fragen, antworten, arten] = await Promise.all([
        fragenRes.json(),
        antwortenRes.json(),
        artenRes.json(),
      ]);

      const mapped: FrageMitAntworten[] = fragen.map((f: Quizfrage) => {
        const art = arten.find((a: Fragenart) => a.FragenartID === f.ArtID);
        const relatedAnswers = antworten.filter(
          (a: Antwortmoeglichkeit) => a.QuizFrageID === f.FrageID
        );

        return {
          id: f.FrageID,
          text: f.FragenText,
          type: art?.Art === "Multiplichoise" ? "multiple" : "single",
          answers: relatedAnswers.map((r: Antwortmoeglichkeit) => ({
            id: r.AntwortID,
            text: r.AntwortenText,
            isCorrect: r.IstRichtig === true,
          })),
        };
      });

      const random5 = mapped.sort(() => 0.5 - Math.random()).slice(0, 16);
      setQuestions(random5);
      setLoading(false);
    };

    fetchQuizData();
  }, []);

  const handleSelect = (answerId: number) => {
    const q = questions[current];
    if (q.type === "single") {
      setSelected([answerId]);
    } else {
      setSelected((prev) =>
        prev.includes(answerId)
          ? prev.filter((id) => id !== answerId)
          : [...prev, answerId]
      );
    }
  };

  const handleCheck = () => setShowResult(true);
  const nextQuestion = () => {
    setShowResult(false);
    setSelected([]);
    setCurrent((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="practice-loadingwrapper">
        <CircularProgress className="loading-spinner" />
        <span>Übungsquiz wird geladen ...</span>
      </div>
    );
  }

  const q = questions[current];
  if (!q) {
    return (
      <div className="practice-loadingwrapper">Keine Fragen gefunden.</div>
    );
  }

  return (
    <>
      <div className="practice-wrapper">
        <h2> Übungsquiz </h2>
        <div className="grid-wrapper">
          <Card className="quiz-card">
            <CardContent>
              <Typography variant="h6" className="question-title">
                Frage {current + 1} von {questions.length}
              </Typography>

              <Typography variant="body1" className="question-text">
                {q.text}
              </Typography>

              {q.answers.map((a) => {
                const isCorrect = a.isCorrect && showResult;
                const isWrong =
                  selected.includes(a.id) && showResult && !a.isCorrect;
                return (
                  <div
                    key={a.id}
                    className={`answer-option ${
                      isCorrect ? "correct" : isWrong ? "wrong" : ""
                    }`}
                  >
                    <FormControlLabel
                      control={
                        q.type === "single" ? (
                          <Radio
                            checked={selected.includes(a.id)}
                            onChange={() => handleSelect(a.id)}
                          />
                        ) : (
                          <Checkbox
                            checked={selected.includes(a.id)}
                            onChange={() => handleSelect(a.id)}
                          />
                        )
                      }
                      label={<span>{a.text}</span>}
                    />
                  </div>
                );
              })}

              {!showResult ? (
                <Button
                  variant="contained"
                  className="quiz-btn primary"
                  onClick={handleCheck}
                  disabled={selected.length === 0}
                >
                  Prüfen
                </Button>
              ) : current < questions.length - 1 ? (
                <Button
                  variant="outlined"
                  className="quiz-btn secondary"
                  onClick={nextQuestion}
                >
                  Nächste Frage
                </Button>
              ) : (
                <div className="btn-wrapper-endPracticequiz">
                  <Typography className="quiz-finished">
                    {" "}
                    Quiz beendet!
                  </Typography>
                  <Button
                    variant="contained"
                    className="quiz-btn primary"
                    onClick={() => window.location.reload()}
                    sx={{ mt: 3 }}
                  >
                    Übungsquiz wiederholen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Button
          variant="outlined"
          component={Link}
          to="/ApQuestions"
          sx={{
            borderColor: "#ff4b4b",
            color: "#ff4b4b",
            borderRadius: "8px",
            padding: "8px 20px",
            marginTop: "20px",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "#ff4b4b",
              color: "#fff",
            },
            transition: "all 0.3s ease",
          }}
        >
          zurück
        </Button>
      </div>
    </>
  );
};

export default PracticeQuiz;
