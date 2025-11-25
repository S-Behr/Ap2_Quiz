export interface Answer {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface QuestionsWithAnswers {
  id: number;
  text: string;
  type: "single" | "multiple";
  answers: Answer[];
}

export interface ExamQuestionResult {
  questionId: number;
  correctAnswerIds: number[];
}

export interface ExamResult {
  totalQuestions: number;
  correctCount: number;
  percentage: number;
  hasPassed: boolean;
  questions: ExamQuestionResult[];
}

export type DisplayStatus =
  | "correct"
  | "incorrect"
  | "missed_correct"
  | "neutral";

export interface AnswerWithStatus extends Answer {
  isUserSelected: boolean;
  isCorrectAnswer: boolean;
  displayStatus: DisplayStatus;
}

export interface QuestionWithResult extends QuestionsWithAnswers {
  isCorrect: boolean;
  answersWithStatus: AnswerWithStatus[];
}
