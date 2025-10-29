// app/quiz-analytic/data.ts

import { CheckCircle2, XCircle, Circle, HelpCircle } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface LearnerAnswer {
  id: string;
  name: string;
  role: string;
  avatar: string;
  designation?: string;
  answers: {
    questionId: string;
    status: "correct" | "incorrect" | "unanswered" | "review";
  }[];
}

export const questions = Array.from({ length: 20 }, (_, i) => ({
  id: `q${i + 1}`,
  title: `Q.${i + 1}`,
  percentage: Math.floor(Math.random() * 81) + 20,
}));

const getRandomStatus = (): "correct" | "incorrect" | "unanswered" => {
  const statuses: ("correct" | "incorrect" | "unanswered")[] = ["correct", "correct", "correct", "incorrect", "unanswered"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const generateAnswers = () => {
  return questions.map(q => ({ questionId: q.id, status: getRandomStatus() }));
};

export const learners: LearnerAnswer[] = [
  {
    id: "1", name: "Adit Irwan", designation: "Design", role: "Sr UI/UX Designer", avatar: "/avatars/01.png", answers: generateAnswers(),
  },
  {
    id: "2", name: "Arif Brata", designation: "Design", role: "Sr UI/UX Designer", avatar: "/avatars/02.png", answers: generateAnswers(),
  },
  {
    id: "3", name: "Ardhi Irwandi", designation: "Design", role: "Sr UI/UX Designer", avatar: "/avatars/03.png", answers: generateAnswers(),
  },
  {
    id: "4", name: "Bagus Yuli", designation: "Design", role: "Sr UI/UX Designer", avatar: "/avatars/04.png", answers: generateAnswers(),
  },
  {
    id: "5", name: "Bani Naon", designation: "Design", role: "Jr UI/UX Designer", avatar: "", answers: generateAnswers(),
  },
  {
    id: "6", name: "Brian", designation: "Design", role: "Sr UI/UX Designer", avatar: "/avatars/01.png", answers: generateAnswers(),
  },
  {
    id: "7", name: "Brian Domani", designation: "Design", role: "Sr UI/UX Designer", avatar: "", answers: generateAnswers(),
  },
  {
    id: "8", name: "Depe Prada", designation: "Design", role: "PM UI/UX Designer", avatar: "", answers: generateAnswers(),
  },
];