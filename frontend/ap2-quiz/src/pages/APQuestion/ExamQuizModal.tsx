import React from "react";
import {
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import type {
  QuestionWithResult,
  AnswerWithStatus,
} from "../../Model/ApQuestion/apQuestionInterface";
import "./ExamQuizModal.css";

interface ExamQuizModalProps {
  open: boolean;
  onClose: () => void;
  questionsWithAnswers: QuestionWithResult[];
}

const ExamQuizModal: React.FC<ExamQuizModalProps> = ({
  open,
  onClose,
  questionsWithAnswers,
}) => {
  const getAnswerStatusClass = (status: string | undefined): string => {
    switch (status) {
      case "correct":
        return "status-correct";
      case "incorrect":
        return "status-incorrect";
      case "missed_correct":
        return "status-missed";
      default:
        return "status-neutral";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle component="div" className="exam-dialog-title">
        <Typography variant="h5" className="exam-dialog-header-text">
          Fragen und Antworten
        </Typography>
      </DialogTitle>

      <DialogContent dividers className="exam-dialog-content">
        <List>
          {questionsWithAnswers.map((q, index) => {
            const questionStatusClass = q.isCorrect
              ? "q-correct"
              : "q-incorrect";

            return (
              <ListItem
                key={q.id}
                className={`exam-question-item ${questionStatusClass}`}
              >
                <Typography
                  variant="h6"
                  className={`exam-question-header ${questionStatusClass}`}
                >
                  {index + 1}. {q.text} {q.isCorrect ? "(Richtig)" : "(Falsch)"}
                </Typography>

                <Typography
                  variant="subtitle1"
                  className="exam-selection-label"
                >
                  Ihre Auswahl:
                </Typography>

                <List dense sx={{ width: "100%" }}>
                  {q.answersWithStatus.map((a: AnswerWithStatus) => {
                    const statusClass = getAnswerStatusClass(a.displayStatus);
                    const boldClass = a.isCorrectAnswer ? "is-bold" : "";

                    return (
                      <ListItem
                        key={a.id}
                        className={`exam-answer-item ${statusClass} ${boldClass}`}
                      >
                        <ListItemText
                          primary={a.text}
                          className="exam-answer-text"
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>

      <Box className="exam-dialog-footer">
        <Button
          onClick={onClose}
          variant="contained"
          className="exam-close-btn"
        >
          Schließen
        </Button>
      </Box>
    </Dialog>
  );
};

export default ExamQuizModal;
