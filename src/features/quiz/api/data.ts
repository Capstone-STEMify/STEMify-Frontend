// app/quiz-active/data.ts

export type QuizStatus = "Completed" | "In Progress";
export type QuizType = "LIVE" | "ASSIGNED";

export interface Learner {
  id: string;
  initials?: string;
  avatarUrl?: string;
}

export interface Quiz {
  id: string;
  name: string;
  type: QuizType;
  subtext?: string;
  status: QuizStatus;
  learners: Learner[];
  extraLearners: number;
  accuracy: number | null;
  assignedDate: string;
  assignedBy: {
    name: string;
    avatarUrl: string;
  };
}

export const quizzes: Quiz[] = [
  {
    id: "1",
    name: "UI Design Fundamentals & Best Practice",
    type: "LIVE",
    subtext: "⚠️ Need Review (1)",
    status: "Completed",
    learners: [{ id: "r", initials: "RA" }, { id: "p", initials: "PA" }],
    extraLearners: 20,
    accuracy: 100,
    assignedDate: "24/01/2023",
    assignedBy: { name: "Ratih", avatarUrl: "/avatars/01.png" },
  },
  {
    id: "2",
    name: "Figma Skill - Tips for using Frame & Group",
    type: "ASSIGNED",
    subtext: "Need Review (16)",
    status: "Completed",
    learners: [{ id: "c", initials: "CI" }, { id: "o", initials: "OW" }],
    extraLearners: 20,
    accuracy: null,
    assignedDate: "24/01/2023",
    assignedBy: { name: "Bock", avatarUrl: "/avatars/02.png" },
  },
  {
    id: "3",
    name: "UX Evaluation: Enhancing User Experience",
    type: "LIVE",
    status: "In Progress",
    learners: [{ id: "u1" }, { id: "u2" }, { id: "u3" }],
    extraLearners: 14,
    accuracy: null,
    assignedDate: "24/01/2023",
    assignedBy: { name: "Tech", avatarUrl: "/avatars/03.png" },
  },
  {
    id: "4",
    name: "Color and Typography in UI Design",
    type: "LIVE",
    status: "Completed",
    learners: [{ id: "j", initials: "JK" }, { id: "u4" }],
    extraLearners: 10,
    accuracy: 80,
    assignedDate: "24/01/2023",
    assignedBy: { name: "Ratih", avatarUrl: "/avatars/01.png" },
  },
   {
    id: "5",
    name: "User Testing and Research in UX Design",
    type: "LIVE",
    status: "In Progress",
    learners: [{ id: 'u5' }, { id: 'u6' }],
    extraLearners: 11,
    accuracy: null,
    assignedDate: "24/01/2023",
    assignedBy: { name: "Ratih", avatarUrl: "/avatars/01.png" },
  },
];