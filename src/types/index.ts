export interface User {
  username: string;
  password: string;
  registrationDate: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  type: 'multiple-choice' | 'translation' | 'listening';
  audioUrl?: string;
}

export interface Level {
  id: number;
  name: string;
  description: string;
  questions: Question[];
  requiredXP: number;
}

export interface LanguageProgress {
  unlockedLevels: number;
  xp: number;
  completedLessons: string[];
  accuracy: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedDate: string;
}

export interface UserData {
  totalXP: number;
  languageProgress: Record<string, LanguageProgress>;
  achievements: Achievement[];
  streak: number;
  lastStudyDate: string | null;
  level: number;
  hearts: number;
}