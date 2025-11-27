import type {
  ExamResult,
  QuestionsWithAnswers,
} from "../../Model/ApQuestion/apQuestionInterface";

export const fetchQuizQuestions = async (
  limit: number
): Promise<QuestionsWithAnswers[]> => {
  try {
    const response = await fetch(
      `http://localhost:3000/quiz-questions?limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }

    const questions: QuestionsWithAnswers[] = await response.json();
    return questions;
  } catch (error) {
    console.error("Fehler im Service beim Laden der Quizdaten:", error);
    throw error;
  }
};

export const fetchCorrectAnswers = async (
  questionId: number
): Promise<number[]> => {
  try {
    const response = await fetch(
      `http://localhost:3000/correct-answers/${questionId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }

    const result = await response.json();

    return result.correctIds || [];
  } catch (error) {
    console.error("Fehler beim Laden der korrekten Antworten:", error);
    throw error;
  }
};

export const submitExam = async (userAnswers: {
  [key: number]: number[];
}): Promise<ExamResult> => {
  try {
    const response = await fetch("http://localhost:3000/submit-exam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userAnswers: userAnswers,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Fehler bei der Prüfungsabgabe: Status ${response.status}`
      );
    }

    const results: ExamResult = await response.json();
    return results;
  } catch (error) {
    console.error("Fehler im Service bei der Prüfungsabgabe:", error);
    throw error;
  }
};
