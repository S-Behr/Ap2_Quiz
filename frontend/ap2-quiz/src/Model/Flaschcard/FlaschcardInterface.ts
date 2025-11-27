export interface RawCategory {
  ID: string;
  KategorieName: string;
}

export interface RawSubCategory {
  ID: string;
  KategorieID: string;
  Titel: string;
}

export interface Flashcard {
  id: string;
  frage: string;
  antwort: string;
}

export interface Subtopic {
  title: string;
  path: string;
  subkategorieId: string;
}

export interface Topic {
  id: string;
  title: string;
}

export interface TopicWithSubtopics extends Topic {
  subtopics: Subtopic[];
}

export interface LazyTopic extends TopicWithSubtopics {
  subtopics: Subtopic[];
  isLoadingSubs: boolean;
}

// export interface LazyTopic extends Topic {
//   loadedSubtopics: Subtopic[] | null;
//   isLoadingSubs: boolean;
// }
