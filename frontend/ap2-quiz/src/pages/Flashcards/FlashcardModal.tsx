import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material";

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
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {title} ({currentIndex + 1} von {cards.length})
      </DialogTitle>
      <DialogContent dividers>
        <div
          style={{
            minHeight: "180px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "20px",
            backgroundColor: "#f9f9f9",
          }}
          onClick={() => setShowAnswer(!showAnswer)}
        >
          <Typography variant="caption" color="textSecondary">
            {showAnswer ? "Antwort" : "Frage"}
          </Typography>
          <Typography
            variant="body1"
            style={{
              marginTop: "10px",
              whiteSpace: "pre-wrap",
              fontWeight: showAnswer ? "bold" : "normal",
            }}
          >
            {showAnswer ? currentCard.antwort : currentCard.frage}
          </Typography>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={handlePrev} variant="outlined">
            Zurück
          </Button>
          <Button
            onClick={() => setShowAnswer(!showAnswer)}
            variant="contained"
            color="primary"
          >
            {showAnswer ? "Frage anzeigen" : "Antwort anzeigen"}
          </Button>
          <Button onClick={handleNext} variant="outlined">
            Weiter
          </Button>
        </div>
      </DialogContent>
      <Button onClick={onClose} style={{ margin: "10px" }}>
        Schließen
      </Button>
    </Dialog>
  );
};

export default FlashcardModal;
