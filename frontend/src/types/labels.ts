import { CourseStatus, Grade } from ".";

// Human-readable labels
export const gradeLabels: Record<Grade, string> = {
  [Grade.A_PLUS]: "A+",
  [Grade.A]: "A",
  [Grade.A_MINUS]: "A-",
  [Grade.B_PLUS]: "B+",
  [Grade.B]: "B",
  [Grade.B_MINUS]: "B-",
  [Grade.C_PLUS]: "C+",
  [Grade.C]: "C",
  [Grade.C_MINUS]: "C-",
  [Grade.D_PLUS]: "D+",
  [Grade.D]: "D",
  [Grade.D_MINUS]: "D-",
  [Grade.F]: "F",
};

export const statusLabels: Record<CourseStatus, string> = {
  [CourseStatus.InProgress]: "In Progress",
  [CourseStatus.Dropped]: "Dropped",
  [CourseStatus.Completed]: "Completed",
};

// Sorted grades (best to worst)
export const sortedGrades: Grade[] = [
  Grade.A_PLUS,
  Grade.A,
  Grade.A_MINUS,
  Grade.B_PLUS,
  Grade.B,
  Grade.B_MINUS,
  Grade.C_PLUS,
  Grade.C,
  Grade.C_MINUS,
  Grade.D_PLUS,
  Grade.D,
  Grade.D_MINUS,
  Grade.F,
];