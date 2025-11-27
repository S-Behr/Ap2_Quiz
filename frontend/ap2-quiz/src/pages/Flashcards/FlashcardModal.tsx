import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material";
import "./FlashcardModal.css";

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
        className: "flashcard-dialog-paper",
      }}
    >
      <DialogTitle className="flashcard-title">
        {title} ({currentIndex + 1} von {cards.length})
      </DialogTitle>

      <DialogContent dividers className="flashcard-content">
        <div
          className={`flashcard-card-container ${
            showAnswer ? "is-answer" : ""
          }`}
          onClick={() => setShowAnswer(!showAnswer)}
        >
          <Typography variant="caption" className="flashcard-label">
            {showAnswer ? "Antwort" : "Frage"}
          </Typography>

          <Typography variant="h6" component="p" className="flashcard-text">
            {showAnswer
              ? formatText(currentCard.antwort)
              : formatText(currentCard.frage)}
          </Typography>
        </div>

        <div className="flashcard-actions">
          <Button
            onClick={handlePrev}
            variant="outlined"
            className="flashcard-btn-outlined"
          >
            Zurück
          </Button>

          <Button
            onClick={() => setShowAnswer(!showAnswer)}
            variant="contained"
            className="flashcard-btn-primary"
          >
            {showAnswer ? "Frage anzeigen" : "Antwort anzeigen"}
          </Button>

          <Button
            onClick={handleNext}
            variant="outlined"
            className="flashcard-btn-outlined"
          >
            Weiter
          </Button>
        </div>
      </DialogContent>

      <Button onClick={onClose} className="flashcard-btn-close">
        Schließen
      </Button>
    </Dialog>
  );
};

export default FlashcardModal;
