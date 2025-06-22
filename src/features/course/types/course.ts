import { SearchPaginatedRequestParams, PaginatedResult } from "@/types/baseModel";

export type Course = {
  id: number;
  title: string;
  imageUrl: string;
  slug: string;
  description: string;
  numberOfSection: number;
  duration: number;
  status: string;
  downloadCount: number;
  isPublic: boolean;
  createdByUserId: string;
  ageRangeId: number;
  createdDate: string; // Consider using Date type if you parse it
  lastModifiedDate: string; // Consider using Date type if you parse it
  ageRangeLabel: string;
  categoryNames: string[];
  skillNames: string[];
  standardNames: string[];
}

export type CourseParams = {
  courseId?: number
} & SearchPaginatedRequestParams