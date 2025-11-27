import React, { useEffect, useState } from "react";
import "./flashcards.css";
import { Button, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import FlashcardModal from "./FlashcardModal";
import type {
  Subtopic,
  Flashcard,
  RawCategory,
  Topic,
} from "../../Model/Flaschcard/FlaschcardInterface";
import {
  fetchCategory,
  fetchFlashcardsBySubtopicId,
  fetchSubCategoryByCategoryId,
} from "../../Service/Flaschcard/flaschcardService";

interface LazyTopic extends Topic {
  loadedSubtopics: Subtopic[] | null;
  isLoadingSubs: boolean;
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
  const [learningFields, setLearningFields] = useState<LazyTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFlashcards, setCurrentFlashcards] = useState<Flashcard[]>([]);
  const [currentSubtopicTitle, setCurrentSubtopicTitle] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const rawCategory: RawCategory[] = await fetchCategory();

        const mappedLearningFields: LazyTopic[] = rawCategory.map((cat) => ({
          id: cat.ID,
          title: cat.KategorieName,
          loadedSubtopics: null,
          isLoadingSubs: false,
        }));

        setLearningFields(mappedLearningFields);
      } catch (err) {
        console.error("Fehler beim Datenabruf:", err);
        setError("Die Lernfelder konnten nicht geladen werden.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const fetchSubtopicsForTopic = async (topicId: string) => {
    setLearningFields((prevLearningFields) =>
      prevLearningFields.map((t) =>
        t.id === topicId ? { ...t, isLoadingSubs: true } : t
      )
    );
    try {
      const rawSubs = await fetchSubCategoryByCategoryId(topicId);

      const subtopics: Subtopic[] = rawSubs.map((sub) => ({
        title: sub.Titel,
        path: slugify(sub.Titel),
        subkategorieId: sub.ID,
      }));

      setLearningFields((prevLearningFields) =>
        prevLearningFields.map((t) =>
          t.id === topicId
            ? { ...t, loadedSubtopics: subtopics, isLoadingSubs: false }
            : t
        )
      );
    } catch (err) {
      console.error("Fehler beim Laden der Unterkategorien:", err);
      setError(
        `Fehler beim Laden der Unterkategorien für Lernfeld ${topicId}.`
      );
      setLearningFields((prevLearningFields) =>
        prevLearningFields.map((t) =>
          t.id === topicId ? { ...t, isLoadingSubs: false } : t
        )
      );
    }
  };

  const handleToggle = (topicId: string) => {
    const isOpening = openTopic !== topicId;
    setOpenTopic(isOpening ? topicId : null);

    if (isOpening) {
      const topic = learningFields.find((t) => t.id === topicId);
      if (topic && topic.loadedSubtopics === null) {
        fetchSubtopicsForTopic(topicId);
      }
    }
  };

  const handleSubtopicClick = async (
    subtopicId: string,
    subtopicTitle: string
  ) => {
    setCurrentSubtopicTitle(subtopicTitle);
    setError(null);
    try {
      const cards: Flashcard[] = await fetchFlashcardsBySubtopicId(subtopicId);

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

  if (isLoading) {
    return (
      <div className="flashcards-loadingwrapper">
        <h1 className="flashcards-main-heading">Lernkarten</h1>
        <CircularProgress className="loading-spinner" />
        <span>Lernkarten werden geladen …</span>
      </div>
    );
  }

  if (error && !isModalOpen) {
    return (
      <div className="flashcards-loadingwrapper">
        <h1 className="flashcards-main-heading">Lernkarten</h1>
        <p className="error-message">{error}</p>
        <Button
          variant="outlined"
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Erneut versuchen
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flashcards-wrapper">
        <div className="grid-wrapper">
          <h2 className="topic-grid-heading">Lernfelder</h2>
          <div className="category-grid">
            {learningFields.map((topic) => (
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
                    {topic.isLoadingSubs ? (
                      <div className="subtopic-loading-box">
                        <CircularProgress size={20} />
                        <p className="subtopic-loading-text">Laden...</p>
                      </div>
                    ) : topic.loadedSubtopics &&
                      topic.loadedSubtopics.length > 0 ? (
                      topic.loadedSubtopics.map((subtopic) => (
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
                      ))
                    ) : (
                      <p className="no-subtopics-message">
                        Keine Unterkategorien verfügbar.
                      </p>
                    )}
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
          className="back-to-home-btn"
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
