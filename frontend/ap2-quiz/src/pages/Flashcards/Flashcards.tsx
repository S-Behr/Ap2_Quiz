import React, { useEffect, useState } from "react";
import "./flashcards.css";
import { Button, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import FlashcardModal from "./FlashcardModal";

interface Flashcard {
  id: string;
  frage: string;
  antwort: string;
}

interface Subtopic {
  title: string;
  path: string;
  subkategorieId: string;
}

interface Topic {
  id: string;
  title: string;
  subtopics: Subtopic[];
}

interface RawKategorie {
  ID: string;
  KategorieName: string;
}

interface RawUnterkategorie {
  ID: string;
  KategorieID: string;
  Titel: string;
}

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const Flashcards: React.FC = () => {
  const [lernfelder, setLernfelder] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFlashcards, setCurrentFlashcards] = useState<Flashcard[]>([]);
  const [currentSubtopicTitle, setCurrentSubtopicTitle] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const katResponse = await fetch("http://localhost:3000/Kategorie");
        const subKatResponse = await fetch(
          "http://localhost:3000/Unterkategorie"
        );

        if (!katResponse.ok || !subKatResponse.ok) {
          throw new Error("Fehler beim Abruf der Daten.");
        }

        const rawKategorien: RawKategorie[] = await katResponse.json();
        const rawUnterkategorien: RawUnterkategorie[] =
          await subKatResponse.json();

        const gemappteLernfelder: Topic[] = rawKategorien.map((kat) => {
          const subtopics: Subtopic[] = rawUnterkategorien
            .filter((sub) => sub.KategorieID === kat.ID)
            .map((sub) => ({
              title: sub.Titel,
              path: slugify(sub.Titel),
              subkategorieId: sub.ID,
            }));

          return {
            id: kat.ID,
            title: kat.KategorieName,
            subtopics: subtopics,
          } as Topic;
        });

        setLernfelder(gemappteLernfelder);
      } catch (err) {
        console.error("Fehler beim Datenabruf:", err);
        setError("Die Lernfelder konnten nicht geladen werden.");
        setLernfelder([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleSubtopicClick = async (
    subtopicId: string,
    subtopicTitle: string
  ) => {
    setCurrentSubtopicTitle(subtopicTitle);

    try {
      const response = await fetch(
        `http://localhost:3000/flashcards/${subtopicId}`
      );

      if (!response.ok) {
        throw new Error("Flashcards konnten nicht geladen werden.");
      }

      const cards: Flashcard[] = await response.json();

      if (cards.length === 0) {
        setError(`Keine Lernkarten für ${subtopicTitle} gefunden.`);
        return;
      }

      setCurrentFlashcards(cards);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Fehler beim Laden der Karten:", err);
      setError("Fehler beim Laden der Lernkarten.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentFlashcards([]);
  };

  const handleToggle = (topicId: string) => {
    setOpenTopic(openTopic === topicId ? null : topicId);
  };

  if (isLoading) {
    return (
      <div className="flashcards-loadingwrapper">
        <h1>Lernkarten</h1>
        <CircularProgress className="loading-spinner" />
        <span>Lernkarten werden geladen …</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flashcards-loadingwrapper">
        <h1>Lernkarten</h1>
        <p style={{ color: "red" }}>{error}</p>
        <Button variant="outlined" onClick={() => window.location.reload()}>
          Erneut versuchen
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flashcards-wrapper">
        <h1>Lernkarten</h1>
        <div className="grid-wrapper">
          <h2>Lernfelder</h2>
          <div className="category-grid">
            {lernfelder.map((topic) => (
              <div
                key={topic.id}
                className={`topic-container ${
                  openTopic === topic.id ? "active" : ""
                }`}
              >
                <button
                  className="topic-header"
                  onClick={() => handleToggle(topic.id)}
                >
                  {topic.title}
                  <span className="expand-icon">
                    {openTopic === topic.id ? "▲" : "▼"}
                  </span>
                </button>
                {openTopic === topic.id && (
                  <div className="subtopic-menu">
                    {topic.subtopics.map((subtopic) => (
                      <button
                        key={subtopic.path}
                        onClick={() =>
                          handleSubtopicClick(
                            subtopic.subkategorieId,
                            subtopic.title
                          )
                        }
                        className="subtopic-link"
                      >
                        {subtopic.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="outlined"
          component={Link}
          to="/"
          sx={{
            borderColor: "#ff4b4b",
            color: "#ff4b4b",
            borderRadius: "8px",
            padding: "8px 20px",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "#ff4b4b",
              color: "#fff",
            },
            transition: "all 0.3s ease",
          }}
        >
          zurück zur Startseite
        </Button>
      </div>

      {isModalOpen && (
        <FlashcardModal
          title={currentSubtopicTitle}
          cards={currentFlashcards}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Flashcards;
