// app/quiz-analytic/data.ts

import { CheckCircle2, XCircle, Circle, HelpCircle } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface LearnerAnswer {
  id: string;
  name: string;
  role: string;
  avatar: string;
  answers: {
    questionId: string;
    status: "correct" | "incorrect" | "unanswered" | "review";
  }[];
}

export const answerIcons: { [key: string]: LucideIcon } = {
  correct: CheckCircle2,
  incorrect: XCircle,
  unanswered: Circle,
  review: HelpCircle,
};

export const answerColors: { [key: string]: string } = {
  correct: "text-green-500",
  incorrect: "text-red-500",
  unanswered: "text-gray-300",
  review: "text-gray-400",
};

export const learners: LearnerAnswer[] = [
  {
    id: "1",
    name: "Adit Irwan",
    role: "Sr UI/UX Designer",
    avatar: "/avatars/01.png",
    answers: [
      { questionId: "q5", status: "correct" },
      { questionId: "q6", status: "correct" },
      { questionId: "q7", status: "correct" },
      { questionId: "q8", status: "correct" },
      { questionId: "q9", status: "unanswered" },
      { questionId: "q10", status: "correct" },
      { questionId: "q11", status: "review" },
    ],
  },
  {
    id: "2",
    name: "Arif Brata",
    role: "Sr UI/UX Designer",
    avatar: "/avatars/02.png",
    answers: [
      { questionId: "q5", status: "correct" },
      { questionId: "q6", status: "unanswered" },
      { questionId: "q7", status: "correct" },
      { questionId: "q8", status: "incorrect" },
      { questionId: "q9", status: "correct" },
      { questionId: "q10", status: "correct" },
      { questionId: "q11", status: "correct" },
    ],
  },
];

export const questions = [
  { id: "q5", title: "Q.5", percentage: 90 },
  { id: "q6", title: "No.6", percentage: 90 },
  { id: "q7", title: "No.7", percentage: 65 },
  { id: "q8", title: "No.8", percentage: 70 },
  { id: "q9", title: "No.9", percentage: 50 },
  { id: "q10", title: "No.10", percentage: 100 },
  { id: "q11", title: "No.11", percentage: 9 },
];