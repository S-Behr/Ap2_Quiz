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
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle
        component="div"
        sx={{ m: 0, p: 2, backgroundColor: "#263238" }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#4dd0e1",
            fontFamily: "'Orbitron', sans-serif",
          }}
        >
          Fragen und Antworten
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: "#263238" }}>
        <List>
          {questionsWithAnswers.map((q, index) => (
            <ListItem
              key={q.id}
              alignItems="flex-start"
              sx={{
                flexDirection: "column",
                alignItems: "stretch",
                mb: 4,
                p: 2,
                borderRadius: "8px",
                border: `2px solid ${q.isCorrect ? "#81c784" : "#e57373"}`,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: q.isCorrect ? "#81c784" : "#e57373",
                  mb: 1,
                }}
              >
                {index + 1}. {q.text} {q.isCorrect ? "(Richtig)" : "(Falsch)"}
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, mt: 2, color: "#4dd0e1" }}
              >
                Ihre Auswahl:
              </Typography>

              <List dense>
                {q.answersWithStatus.map((a: AnswerWithStatus) => {
                  const isCorrectStatus = a.displayStatus === "correct";
                  const isIncorrectStatus = a.displayStatus === "incorrect";
                  const isMissedCorrectStatus =
                    a.displayStatus === "missed_correct";

                  const borderColor =
                    isCorrectStatus || isMissedCorrectStatus
                      ? "#81c784"
                      : isIncorrectStatus
                      ? "#e57373"
                      : "transparent";

                  const backgroundColor = isCorrectStatus
                    ? "rgba(129, 199, 132, 0.2)"
                    : isIncorrectStatus
                    ? "rgba(229, 115, 115, 0.2)"
                    : isMissedCorrectStatus
                    ? "rgba(77, 208, 225, 0.1)"
                    : "transparent";

                  const textColor =
                    isCorrectStatus || isMissedCorrectStatus
                      ? "#81c784"
                      : isIncorrectStatus
                      ? "#e57373"
                      : "#e0f7fa";

                  return (
                    <ListItem
                      key={a.id}
                      sx={{
                        pl: 2,
                        borderRadius: "4px",
                        mb: 0.5,
                        backgroundColor: backgroundColor,
                        borderLeft: `4px solid ${borderColor}`,
                      }}
                    >
                      <ListItemText
                        primary={a.text}
                        sx={{
                          color: textColor,
                          fontWeight: a.isCorrectAnswer ? 700 : 400,
                        }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </ListItem>
          ))}
        </List>
      </DialogContent>

      <Box p={2} textAlign="right" sx={{ backgroundColor: "#263238" }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#4dd0e1",
            "&:hover": { backgroundColor: "#00bcd4" },
            color: "#263238",
            fontWeight: 700,
          }}
        >
          Schließen
        </Button>
      </Box>
    </Dialog>
  );
};

export default ExamQuizModal;
