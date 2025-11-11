import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material";
import "./flashcards.css";

interface Flashcard {
  id: string;
  frage: string;
  antwort: string;
}

interface FlashcardModalProps {
  title: string;
  cards: Flashcard[];
  onClose: () => void;
}

const formatText = (text: string | undefined): string => {
  if (!text) return "";

  const insertNewlinesOutsideParentheses = (input: string) => {
    let result = "";
    let depth = 0;

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if (char === "(") depth++;
      if (char === ")") depth = Math.max(0, depth - 1);
      result += char;

      if (depth === 0) {
        const nextChar = input[i + 1];
        if (
          char === "." &&
          !(i > 0 && /\d/.test(input[i - 1])) &&
          nextChar &&
          nextChar !== "\n"
        ) {
          result += "\n";
        }

        if ((char === "!" || char === "?") && nextChar && nextChar !== "\n") {
          result += "\n";
        }
      }
    }

    return result;
  };

  let formatted = text
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/\s+/g, " ")
    .replace(/(:\s)/g, "$1\n")
    .replace(/\)\.\s*(?=[A-ZÄÖÜ])/g, ").\n")
    .trim();

  formatted = insertNewlinesOutsideParentheses(formatted)
    .replace(/\n{2,}/g, "\n")
    .trim();

  return formatted;
};

const FlashcardModal: React.FC<FlashcardModalProps> = ({
  title,
  cards,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (cards.length === 0) {
    return null;
  }

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setShowAnswer(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handlePrev = () => {
    setShowAnswer(false);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + cards.length) % cards.length
    );
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          background: "linear-gradient(145deg, #ffe3e3, #ffd6d6)",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: "1.6rem",
          background: "linear-gradient(90deg, #ff6a88, #ff99ac)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title} ({currentIndex + 1} von {cards.length})
      </DialogTitle>

      <DialogContent dividers>
        <div
          style={{
            minHeight: "200px",
            padding: "20px",
            borderRadius: "16px",
            cursor: "pointer",
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: showAnswer
              ? "linear-gradient(135deg, #ffb6b6, #ff7f7f)"
              : "linear-gradient(135deg, #ffe3e3, #ffd6d6)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
            color: showAnswer ? "#fff" : "#333",
            textAlign: "center",
            fontWeight: showAnswer ? "700" : "400",
            whiteSpace: "pre-line",
            lineHeight: 1.6,
          }}
          onClick={() => setShowAnswer(!showAnswer)}
        >
          <Typography
            variant="caption"
            sx={{ mb: 1, color: showAnswer ? "#f0f0f0" : "#666" }}
          >
            {showAnswer ? "Antwort" : "Frage"}
          </Typography>
          <Typography variant="body1">
            {showAnswer
              ? formatText(currentCard.antwort)
              : formatText(currentCard.frage)}
          </Typography>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            onClick={handlePrev}
            variant="outlined"
            sx={{
              borderColor: "#ff4b4b",
              color: "#ff4b4b",
              "&:hover": { backgroundColor: "#ff4b4b", color: "#fff" },
            }}
          >
            Zurück
          </Button>

          <Button
            onClick={() => setShowAnswer(!showAnswer)}
            variant="contained"
            sx={{
              background: "linear-gradient(90deg, #ff7f7f, #ff4b4b)",
              "&:hover": {
                background: "linear-gradient(90deg, #ff4b4b, #ff1f1f)",
              },
            }}
          >
            {showAnswer ? "Frage anzeigen" : "Antwort anzeigen"}
          </Button>

          <Button
            onClick={handleNext}
            variant="outlined"
            sx={{
              borderColor: "#ff4b4b",
              color: "#ff4b4b",
              "&:hover": { backgroundColor: "#ff4b4b", color: "#fff" },
            }}
          >
            Weiter
          </Button>
        </div>
      </DialogContent>

      <Button
        onClick={onClose}
        sx={{
          margin: "10px auto",
          display: "block",
          color: "#ff4b4b",
          "&:hover": { backgroundColor: "#ffe3e3" },
        }}
      >
        Schließen
      </Button>
    </Dialog>
  );
};

export default FlashcardModal;
