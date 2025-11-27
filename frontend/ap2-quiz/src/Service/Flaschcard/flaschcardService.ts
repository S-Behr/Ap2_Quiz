import type {
  RawCategory,
  RawSubCategory,
  Flashcard,
} from "../../Model/Flaschcard/FlaschcardInterface";

const API_URL = "http://localhost:3000";

export const fetchCategory = async (): Promise<RawCategory[]> => {
  try {
    const response = await fetch(`${API_URL}/Kategorie`);
    if (!response.ok) throw new Error("Fehler beim Laden der Kategorien.");
    return response.json();
  } catch (error) {
    console.error("Kategorien-Service Fehler:", error);
    throw error;
  }
};

export const fetchSubCategoryByCategoryId = async (
  kategorieId: string
): Promise<RawSubCategory[]> => {
  try {
    const response = await fetch(
      `${API_URL}/Unterkategorie?KategorieID=${kategorieId}`
    );
    if (!response.ok) throw new Error("Fehler beim Laden der Unterkategorien.");
    return response.json();
  } catch (error) {
    console.error("Unterkategorien-Service Fehler:", error);
    throw error;
  }
};

export const fetchFlashcardsBySubtopicId = async (
  subtopicId: string
): Promise<Flashcard[]> => {
  try {
    const response = await fetch(`${API_URL}/flashcards/${subtopicId}`);
    if (!response.ok) throw new Error("Fehler beim Laden der Flashcards.");
    return response.json();
  } catch (error) {
    console.error("Flashcard-Service Fehler:", error);
    throw error;
  }
};
