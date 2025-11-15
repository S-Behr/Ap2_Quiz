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

  const SPACE_BG = "rgba(33, 33, 50, 0.95)";
  const NEON_CYAN_GRADIENT = "linear-gradient(90deg, #4dd0e1, #81d4fa)";
  const NEON_CYAN_COLOR = "#4dd0e1";
  const TEXT_COLOR = "#e0f7fa";
  const PRIMARY_BUTTON_BG = "linear-gradient(90deg, #4dd0e1, #81d4fa)";
  const SECONDARY_BUTTON_COLOR = "#4dd0e1";
  const SECONDARY_BUTTON_HOVER_BG = "rgba(77, 208, 225, 0.1)";

  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          background: SPACE_BG,
          borderRadius: "12px",
          boxShadow:
            "0 0 25px rgba(77, 208, 225, 0.4), 0 10px 40px rgba(0,0,0,0.4)",
          color: TEXT_COLOR,
          fontFamily: "'Orbitron', sans-serif",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: "1.6rem",
          background: NEON_CYAN_GRADIENT,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 8px rgba(77, 208, 225, 0.4)",
          borderBottom: `1px solid rgba(77, 208, 225, 0.2)`,
          paddingBottom: 2,
        }}
      >
        {title} ({currentIndex + 1} von {cards.length})
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: "rgba(77, 208, 225, 0.2)" }}>
        <div
          style={{
            minHeight: "250px",
            padding: "25px",
            borderRadius: "12px",
            cursor: "pointer",
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: showAnswer
              ? "linear-gradient(135deg, #1f0040, #2a0050)"
              : "rgba(15, 0, 30, 0.9)",
            boxShadow: showAnswer
              ? "0 0 20px rgba(129, 212, 250, 0.6)"
              : "0 0 10px rgba(77, 208, 225, 0.3)",
            transition: "all 0.3s ease",
            color: TEXT_COLOR,
            textAlign: "center",
            fontWeight: showAnswer ? "600" : "400",
            whiteSpace: "pre-line",
            lineHeight: 1.7,
            border: `1px solid ${
              showAnswer ? NEON_CYAN_COLOR : "rgba(77, 208, 225, 0.2)"
            }`,
          }}
          onClick={() => setShowAnswer(!showAnswer)}
        >
          <Typography
            variant="caption"
            sx={{
              mb: 1.5,
              color: NEON_CYAN_COLOR,
              fontWeight: 700,
              textShadow: "0 0 5px rgba(77, 208, 225, 0.4)",
            }}
          >
            {showAnswer ? "Antwort" : "Frage"}
          </Typography>
          <Typography variant="h6" component="p" sx={{ color: TEXT_COLOR }}>
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
              borderColor: SECONDARY_BUTTON_COLOR,
              color: SECONDARY_BUTTON_COLOR,
              textTransform: "uppercase",
              padding: "8px 15px",
              "&:hover": {
                backgroundColor: SECONDARY_BUTTON_HOVER_BG,
                color: TEXT_COLOR,
                borderColor: NEON_CYAN_COLOR,
              },
            }}
          >
            Zurück
          </Button>

          <Button
            onClick={() => setShowAnswer(!showAnswer)}
            variant="contained"
            sx={{
              background: PRIMARY_BUTTON_BG,
              color: "#0d001a",
              fontWeight: 600,
              textTransform: "uppercase",
              padding: "10px 20px",
              boxShadow: "0 0 10px rgba(77, 208, 225, 0.5)",
              "&:hover": {
                background: "linear-gradient(90deg, #81d4fa, #4dd0e1)",
                boxShadow: "0 0 20px rgba(77, 208, 225, 0.8)",
                transform: "translateY(-1px)",
              },
            }}
          >
            {showAnswer ? "Frage anzeigen" : "Antwort anzeigen"}
          </Button>

          <Button
            onClick={handleNext}
            variant="outlined"
            sx={{
              borderColor: SECONDARY_BUTTON_COLOR,
              color: SECONDARY_BUTTON_COLOR,
              textTransform: "uppercase",
              padding: "8px 15px",
              "&:hover": {
                backgroundColor: SECONDARY_BUTTON_HOVER_BG,
                color: TEXT_COLOR,
                borderColor: NEON_CYAN_COLOR,
              },
            }}
          >
            Weiter
          </Button>
        </div>
      </DialogContent>

      <Button
        onClick={onClose}
        sx={{
          margin: "20px auto",
          display: "block",
          color: NEON_CYAN_COLOR,
          fontWeight: 600,
          textTransform: "uppercase",
          "&:hover": {
            backgroundColor: SECONDARY_BUTTON_HOVER_BG,
            color: TEXT_COLOR,
          },
        }}
      >
        Schließen
      </Button>
    </Dialog>
  );
};

export default FlashcardModal;
