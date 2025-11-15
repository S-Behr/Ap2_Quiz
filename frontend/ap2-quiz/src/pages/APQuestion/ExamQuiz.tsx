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
  Box,
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
  Art: "Singlechoise" | "Multiplichoise";
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

const EXAM_DURATION_SECONDS = 1800; // 30 Minuten * 60 Sekunden

const ExamQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<FrageMitAntworten[]>([]);
  const [current, setCurrent] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number[] }>(
    {}
  );
  const [examFinished, setExamFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);

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

      const random5 = mapped.sort(() => 0.5 - Math.random()).slice(0, 15);
      setQuestions(random5);
      setLoading(false);
    };

    fetchQuizData();
  }, []);

  useEffect(() => {
    if (loading || examFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, examFinished]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSelect = (
    questionId: number,
    answerId: number,
    type: "single" | "multiple"
  ) => {
    setUserAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];

      if (type === "single") {
        return { ...prev, [questionId]: [answerId] };
      } else {
        const newAnswers = currentAnswers.includes(answerId)
          ? currentAnswers.filter((id) => id !== answerId)
          : [...currentAnswers, answerId];
        return { ...prev, [questionId]: newAnswers };
      }
    });
  };

  const handleSubmitQuiz = () => {
    setExamFinished(true);
  };

  const calculateResults = () => {
    let correctCount = 0;

    questions.forEach((q) => {
      const correctIds = q.answers
        .filter((a) => a.isCorrect)
        .map((a) => a.id)
        .sort();
      const userIds = (userAnswers[q.id] || []).sort();
      const isCorrect =
        correctIds.length === userIds.length &&
        correctIds.every((val, index) => val === userIds[index]);

      if (isCorrect) {
        correctCount++;
      }
    });

    const totalQuestions = questions.length;
    const percentage = (correctCount / totalQuestions) * 100;
    const hasPassed = percentage > 50;

    return { correctCount, totalQuestions, percentage, hasPassed };
  };

  if (loading) {
    return (
      <div className="practice-loadingwrapper">
        <CircularProgress className="loading-spinner" />
        <span>Prüfungsquiz wird geladen...</span>
      </div>
    );
  }

  if (examFinished) {
    const { correctCount, totalQuestions, percentage, hasPassed } =
      calculateResults();
    const resultColor = hasPassed ? "#81c784" : "#e57373";

    return (
      <div className="practice-wrapper">
        <h2> PRÜFUNGSERGEBNIS </h2>
        <Card className="quiz-card" sx={{ maxWidth: 500 }}>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{
                color: resultColor,
                fontWeight: 700,
                mb: 2,
                textShadow: `0 0 10px ${resultColor}50`,
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: 1,
              }}
            >
              {hasPassed ? " PRÜFUNG BESTANDEN" : "NICHT BESTANDEN"}
            </Typography>

            <Typography variant="h5" className="question-text" sx={{ mt: 3 }}>
              Korrekte Antworten:
            </Typography>
            <Typography
              variant="h3"
              sx={{ color: resultColor, fontWeight: 700 }}
            >
              {correctCount} / {totalQuestions}
            </Typography>

            <Typography variant="h5" className="question-text" sx={{ mt: 3 }}>
              Erreichte Punktzahl:
            </Typography>
            <Typography variant="h3" sx={{ color: "#4dd0e1", fontWeight: 700 }}>
              {percentage.toFixed(1)} %
            </Typography>

            <Button
              variant="contained"
              className="quiz-btn primary"
              onClick={() => window.location.reload()}
              sx={{ mt: 3 }}
            >
              Prüfung wiederholen
            </Button>
          </CardContent>
        </Card>

        <Button
          variant="outlined"
          component={Link}
          to="/ApQuestions"
          className="quiz-btn secondary"
          sx={{ mt: 3, padding: "10px 30px" }}
        >
          Zurück zur Auswahl
        </Button>
      </div>
    );
  }
  const q = questions[current];
  if (!q)
    return (
      <div className="practice-loadingwrapper">Keine Fragen gefunden.</div>
    );

  const isLastQuestion = current === questions.length - 1;
  const currentSelected = userAnswers[q.id] || [];

  return (
    <>
      <div className="practice-wrapper">
        <h2> EXAMENSQUIZ </h2>
        <Box
          sx={{
            marginBottom: 2,
            padding: "8px 15px",
            borderRadius: "6px",
            backgroundColor:
              timeLeft <= 60
                ? "rgba(255, 0, 0, 0.2)"
                : "rgba(77, 208, 225, 0.1)",
            border: `1px solid ${timeLeft <= 60 ? "#ff4b4b" : "#4dd0e1"}`,
            color: timeLeft <= 60 ? "#ff4b4b" : "#4dd0e1",
            fontWeight: 600,
            fontFamily: "'Orbitron', sans-serif",
            boxShadow: "0 0 10px rgba(77, 208, 225, 0.3)",
          }}
        >
          Verbleibende Zeit: {formatTime(timeLeft)}
        </Box>

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
                const isSelected = currentSelected.includes(a.id);
                return (
                  <div
                    key={a.id}
                    className={`answer-option ${
                      isSelected ? "selected-exam-option" : ""
                    }`}
                  >
                    <FormControlLabel
                      control={
                        q.type === "single" ? (
                          <Radio
                            checked={isSelected}
                            onChange={() => handleSelect(q.id, a.id, q.type)}
                            sx={{
                              color: isSelected
                                ? "#4dd0e1"
                                : "rgba(224, 247, 250, 0.7)",
                            }}
                          />
                        ) : (
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelect(q.id, a.id, q.type)}
                            sx={{
                              color: isSelected
                                ? "#4dd0e1"
                                : "rgba(224, 247, 250, 0.7)",
                            }}
                          />
                        )
                      }
                      label={
                        <span
                          style={{ color: isSelected ? "#4dd0e1" : "#e0f7fa" }}
                        >
                          {a.text}
                        </span>
                      }
                    />
                  </div>
                );
              })}

              <Box display="flex" justifyContent="space-between" mt={3}>
                <Button
                  variant="outlined"
                  className="quiz-btn secondary"
                  onClick={() => setCurrent((prev) => Math.max(0, prev - 1))}
                  disabled={current === 0}
                >
                  Zurück
                </Button>

                <Button
                  variant="contained"
                  className="quiz-btn primary"
                  onClick={
                    isLastQuestion
                      ? handleSubmitQuiz
                      : () => setCurrent((prev) => prev + 1)
                  }
                  disabled={currentSelected.length === 0 && !isLastQuestion}
                >
                  {isLastQuestion ? "PRÜFUNG BEENDEN" : "Nächste Frage"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </div>

        <Button
          variant="outlined"
          component={Link}
          to="/ApQuestions"
          className="quiz-btn secondary"
          sx={{ mt: 3, padding: "10px 30px" }}
        >
          Zurück zur Auswahl
        </Button>
      </div>
    </>
  );
};

export default ExamQuiz;
