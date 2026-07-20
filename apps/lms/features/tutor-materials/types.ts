export type MaterialStatus = 'Not Generated' | 'Drafting' | 'Published';

export interface AIAnalyzeRequest {
  transcript: string;
  subject: string;
  num_questions: number;
}

export interface Lesson {
  id: string;
  studentName: string;
  subject: string;
  date: string;
  status: MaterialStatus;
}

export interface Formula {
  latex: string;
  description: string;
}

export interface KeyConcept {
  name: string;
  explanation: string;
  formulas: Formula[];
}

export interface TheorySummary {
  title: string;
  overview: string;
  key_concepts: KeyConcept[];
  prerequisites: string[];
}

export interface QuizOption {
  label: string;
  content: string;
}

export interface MultipleChoiceQuestion {
  question: string;
  options: QuizOption[];
  correct_answer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SolutionStep {
  step_number: number;
  description: string;
}

export interface EssayExercise {
  problem: string;
  solution_steps: SolutionStep[];
  final_answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizData {
  multiple_choice: MultipleChoiceQuestion[];
  exercises: EssayExercise[];
}

export interface AIAnalyzeResponse {
  summary: TheorySummary;
  quiz: QuizData;
}
