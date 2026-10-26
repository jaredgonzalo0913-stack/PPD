export type Page = 'home' | 'modules' | 'engine-lab' | 'components' | 'system-explorer' | 'assessments' | 'progress';

export interface Component {
  id: string;
  name: string;
  category: 'sensor' | 'actuator' | 'electronic' | 'hydraulic' | 'mechanical';
  shortDescription: string;
  purpose: string;
  function: string;
  howItWorks: string;
  roleInMEC: string;
  relatedComponents: string[];
  keyLearningPoint: string;
  image?: string;
  model3D?: string;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  assessments?: FormativeAssessment[];
  completed: boolean;
  progress: number;
}

export interface FormativeAssessment {
  id: string;
  title: string;
  instruction: string;
  platform?: string;
  cbt?: string;
  practicalAssessment?: string;
  rubric?: string;
  requiredSubmissionDetails: string;
  exampleFilename: string;
  exampleDetails?: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  diagram?: string;
  components: string[];
  quiz?: Quiz;
}

export interface Quiz {
  id: string;
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'identification' | 'scenario';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

export interface StudentProgress {
  moduleScores: Record<string, number>;
  componentsExplored: string[];
  quizzesCompleted: number;
  totalXP: number;
  achievements: string[];
  lessonsCompleted: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}
