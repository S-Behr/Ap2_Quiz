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
import { fetchQuizQuestions } from "../../Service/ApQuestion/quizService";
import type { QuestionsWithAnswers } from "../../Model/ApQuestion/apQuestionInterface";
import { fetchCorrectAnswers } from "../../Service/ApQuestion/quizService";

const PracticeQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionsWithAnswers[]>([]);
  const [current, setCurrent] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [correctAnswerIds, setCorrectAnswerIds] = useState<number[]>([]);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const loadedQuestions = await fetchQuizQuestions(5);
        setQuestions(loadedQuestions);
      } catch (error) {
        console.error("Fehler beim Laden der Quizdaten:", error);
        alert(
          "Es ist ein Fehler beim der Fragen aufgetreten. Bitte versuchen Sie es erneut."
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, []);

  const handleSelect = (answerId: number) => {
    const question = questions[current];
    if (question.type === "single") {
      setSelectedAnswer([answerId]);
    } else {
      setSelectedAnswer((prev) =>
        prev.includes(answerId)
          ? prev.filter((id) => id !== answerId)
          : [...prev, answerId]
      );
    }
  };

  const handleCheck = async () => {
    try {
      const correctIds = await fetchCorrectAnswers(questions[current].id);
      setCorrectAnswerIds(correctIds);
      setShowResult(true);
    } catch (error) {
      console.error("Fehler bei der Überprüfung der Antwort:", error);
      alert(
        "Es ist ein Fehler bei der Überprüfung der Antwort aufgetreten. Bitte versuchen Sie es erneut."
      );
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    setShowResult(false);
    setSelectedAnswer([]);
    setCorrectAnswerIds([]);
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

  const question = questions[current];
  if (!question) {
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
                {question.text}
              </Typography>

              {question.answers.map((answer) => {
                const isCorrect =
                  correctAnswerIds.includes(answer.id) && showResult;
                const isWrong =
                  selectedAnswer.includes(answer.id) &&
                  showResult &&
                  !correctAnswerIds.includes(answer.id);
                return (
                  <div
                    key={answer.id}
                    className={`answer-option ${
                      isCorrect ? "correct" : isWrong ? "wrong" : ""
                    }`}
                  >
                    <FormControlLabel
                      control={
                        question.type === "single" ? (
                          <Radio
                            checked={selectedAnswer.includes(answer.id)}
                            onChange={() => handleSelect(answer.id)}
                            disabled={showResult}
                          />
                        ) : (
                          <Checkbox
                            checked={selectedAnswer.includes(answer.id)}
                            onChange={() => handleSelect(answer.id)}
                            disabled={showResult}
                          />
                        )
                      }
                      label={<span>{answer.text}</span>}
                    />
                  </div>
                );
              })}

              {!showResult ? (
                <Button
                  variant="contained"
                  className="quiz-btn primary check-button"
                  onClick={handleCheck}
                  disabled={selectedAnswer.length === 0}
                >
                  Prüfen
                </Button>
              ) : current < questions.length - 1 ? (
                <Button
                  variant="outlined"
                  className="quiz-btn secondary next-question-button"
                  onClick={nextQuestion}
                >
                  Nächste Frage
                </Button>
              ) : (
                <div className="btn-wrapper-end-Practicequiz">
                  <Typography className="quiz-finished">
                    Quiz beendet!
                  </Typography>

                  <Button
                    variant="contained"
                    className="quiz-btn primary repeat-button"
                    onClick={() => window.location.reload()}
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
          className="quiz-btn-back"
        >
          zurück zur Quizübersicht
        </Button>
      </div>
    </>
  );
};

export default PracticeQuiz;
