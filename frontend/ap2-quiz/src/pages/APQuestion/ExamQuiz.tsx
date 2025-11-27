import React, { useEffect, useState, useMemo, useCallback } from "react";
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
import {
  fetchQuizQuestions,
  submitExam,
} from "../../Service/ApQuestion/quizService";
import ExamQuizModal from "./ExamQuizModal";
import type {
  QuestionsWithAnswers,
  ExamResult,
  QuestionWithResult,
  DisplayStatus,
} from "../../Model/ApQuestion/apQuestionInterface";

const examTimer = 10; // 30 * 60 Sekunden

const ExamQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionsWithAnswers[]>([]);
  const [current, setCurrent] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number[] }>(
    {}
  );
  const [examFinished, setExamFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(examTimer);
  const [examResults, setExamResults] = useState<ExamResult | null>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        const loadedQuestions = await fetchQuizQuestions(8);
        setQuestions(loadedQuestions);
      } catch (error) {
        console.error("Fehler beim Laden der Quizdaten:", error);
        alert("Fehler beim Laden der Fragen. Bitte erneut versuchen.");
      } finally {
        setLoading(false);
      }
    };
    loadQuizData();
  }, []);

  const handleSubmitQuiz = useCallback(async () => {
    console.log("SUBMITTING DATA:", userAnswers);
    setLoading(true);
    try {
      const results = await submitExam(userAnswers);
      setExamResults(results);
      setExamFinished(true);
    } catch (error) {
      console.error("Prüfungsfehler:", error);
      setExamFinished(true);
    } finally {
      setLoading(false);
    }
  }, [userAnswers]);

  useEffect(() => {
    if (loading || examFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, examFinished]);

  useEffect(() => {
    if (timeLeft === 0 && !examFinished && !loading) {
      handleSubmitQuiz();
    }
  }, [timeLeft, examFinished, loading, handleSubmitQuiz]);

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
      let updated;
      if (type === "single") {
        updated = { ...prev, [questionId]: [answerId] };
      } else {
        const newAnswers = currentAnswers.includes(answerId)
          ? currentAnswers.filter((id) => id !== answerId)
          : [...currentAnswers, answerId];
        updated = { ...prev, [questionId]: newAnswers };
      }
      return updated;
    });
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const questionsWithAnswers: QuestionWithResult[] = useMemo(() => {
    if (questions.length === 0) return [];

    return questions.map((q) => {
      const userAnswerIds = userAnswers[q.id] ?? [];
      const correctAnswerIds: number[] =
        (examFinished && examResults?.questions
          ? examResults.questions.find((res) => res.questionId === q.id)
              ?.correctAnswerIds
          : undefined) ?? [];

      const isQuestionCorrect =
        correctAnswerIds.length > 0 &&
        correctAnswerIds.length === userAnswerIds.length &&
        correctAnswerIds.every((id) => userAnswerIds.includes(id));

      const answersWithStatus = q.answers.map((a) => {
        const isUserSelected = userAnswerIds.includes(a.id);
        const isActuallyCorrect = correctAnswerIds.includes(a.id);

        let displayStatus: DisplayStatus = "neutral";

        if (examFinished) {
          if (correctAnswerIds.length > 0) {
            if (isUserSelected && isActuallyCorrect) {
              displayStatus = "correct";
            } else if (isUserSelected && !isActuallyCorrect) {
              displayStatus = "incorrect";
            } else if (!isUserSelected && isActuallyCorrect) {
              displayStatus = "missed_correct";
            }
          } else {
            displayStatus = "neutral";
          }
        }

        return {
          ...a,
          isUserSelected,
          isCorrectAnswer: isActuallyCorrect,
          displayStatus,
        };
      });

      return {
        ...q,
        answersWithStatus,
        isCorrect: correctAnswerIds.length > 0 ? isQuestionCorrect : false,
      };
    });
  }, [questions, userAnswers, examFinished, examResults]);

  if (loading) {
    return (
      <div className="practice-loadingwrapper">
        <CircularProgress className="loading-spinner" />
        <span>
          {examFinished
            ? "Ergebnisse werden berechnet..."
            : "Quiz wird geladen..."}
        </span>
      </div>
    );
  }

  if (examFinished) {
    if (!examResults) {
      return (
        <div className="practice-loadingwrapper">
          <div className="timeout">
            <p>Die Zeit ist um!</p>
            <p> Es wurden keine keine Frage beantwortet.</p>
          </div>
          <div className="timeout-btn">
            <Button
              variant="contained"
              className="quiz-btn primary"
              onClick={() => window.location.reload()}
            >
              Prüfung wiederholen
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to="/ApQuestions"
              className=" quiz-btn primary"
            >
              Zurück zur Quizauswahl
            </Button>
          </div>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/"
            className="back-to-home-btn "
          >
            zurück zur Startseite
          </Button>
        </div>
      );
    }

    const { correctCount, totalQuestions, percentage, hasPassed } = examResults;
    const resultStatusClass = hasPassed ? "result-pass" : "result-fail";

    return (
      <div className="practice-wrapper">
        <h2>PRÜFUNGSERGEBNIS</h2>
        <Card className="quiz-card result-card">
          <CardContent className="result-content-container">
            <Typography
              variant="h4"
              className={`result-heading ${resultStatusClass}`}
            >
              {hasPassed ? "PRÜFUNG BESTANDEN" : "NICHT BESTANDEN"}
            </Typography>
            <Typography variant="h5" className="result-score-label">
              Korrekte Antworten:
            </Typography>
            <Typography
              variant="h3"
              className={`result-count ${resultStatusClass}`}
            >
              {correctCount} / {totalQuestions}
            </Typography>
            <Typography variant="h5" className="result-score-label">
              Erreichte Punktzahl:
            </Typography>
            <Typography variant="h3" className="result-percentage">
              {percentage.toFixed(1)} %
            </Typography>

            <Box className="result-button-container">
              <Button
                variant="contained"
                className="quiz-btn primary"
                onClick={handleOpenModal}
              >
                Zu den Fragen/Antworten
              </Button>
              <Button
                variant="contained"
                className="quiz-btn primary"
                onClick={() => window.location.reload()}
              >
                Prüfung wiederholen
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Button
          variant="outlined"
          component={Link}
          to="/ApQuestions"
          className=" back-to-selection-btn"
        >
          Zurück zur Auswahl
        </Button>

        <ExamQuizModal
          open={openModal}
          onClose={handleCloseModal}
          questionsWithAnswers={questionsWithAnswers}
        />
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
  const timerClass = timeLeft <= 60 ? "timer-warning" : "timer-normal";

  return (
    <div className="practice-wrapper">
      <h2>EXAMENSQUIZ</h2>
      <Box className={`exam-timer-box ${timerClass}`}>
        Verbleibende Zeit: {formatTime(timeLeft)}
      </Box>

      <div className="grid-wrapper">
        <Card className="quiz-card">
          <CardContent>
            <Typography variant="h6" className="question-title">
              Frage {current + 1} von {questions.length}
            </Typography>
            <Typography variant="body1" className="question-text-exam">
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
                        />
                      ) : (
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelect(q.id, a.id, q.type)}
                        />
                      )
                    }
                    label={
                      <span
                        className={`answer-label-text ${
                          isSelected ? "answer-label-selected" : ""
                        }`}
                      >
                        {a.text}
                      </span>
                    }
                  />
                </div>
              );
            })}

            <Box className="navigation-button-container">
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
        className=" back-to-selection-btn"
      >
        Zurück zur Auswahl
      </Button>
    </div>
  );
};

export default ExamQuiz;
