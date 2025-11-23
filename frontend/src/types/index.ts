// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'STUDENT' | 'LECTURER' | 'ADMIN' | 'SUPER_ADMIN';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  user: User;
}

export interface UserCreationReq {
  name: string;
  email: string;
  password: string;
}

// Course Types
export enum CourseStatus {
  InProgress = 'InProgress',
  Completed = 'Completed',
  Dropped = 'Dropped'
}

export enum Grade {
  A_PLUS = 'A_PLUS',
  A = 'A',
  A_MINUS = 'A_MINUS',
  B_PLUS = 'B_PLUS',
  B = 'B',
  B_MINUS = 'B_MINUS',
  C_PLUS = 'C_PLUS',
  C = 'C',
  C_MINUS = 'C_MINUS',
  D_PLUS = 'D_PLUS',
  D = 'D',
  D_MINUS = 'D_MINUS',
  F = 'F'
}

export interface CourseCreationReq {
  name: string;
  startDate: string;
  endDate: string;
  courseStartRegistirationDate: string;
  courseEndRegistirationDate: string;
  lecturerId: number;
  prerequisiteCoursesIds: number[];
  isActive: boolean;
}

export interface CourseResponse {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  courseStartRegistirationDate: string;
  courseEndRegistirationDate: string;
  lecturerID: number;
  lecturerName: string;
  prerequisiteCoursesNames: string[];
  lecturesTime: LectureTimeResponse[];
}

export interface CourseUpdateReq {
  name: string;
  startDate: string;
  endDate: string;
  courseStartRegistirationDate: string;
  courseEndRegistirationDate: string;
  lecturerId: number;
  isActive: boolean;
}

// Lecture Time Types
export enum Day {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}

export interface LectureTimeRequest {
  courseId: number;
  day: Day;
  time: string;
}

export interface LectureTimeResponse {
  id: number;
  day: Day;
  time: string;
}

// Enrollment Types
export interface EnrollmentRequest {
  studentId: number;
  courseId: number;
  semester: number;
}

export interface EnrollmentResponse {
  id: number;
  studentId: number;
  studentName: string;
  courseId: number;
  courseName: string;
  enrollmentDate: string;
  grade: Grade;
  semester: number;
  status: CourseStatus;
}

export interface StudentEnrollmentsResponse {
  id: number;
  courseId: number;
  courseName: string;
  enrollmentDate: string;
  grade: Grade;
  semester: number;
  status: CourseStatus;
}

export interface EnrollmentChangeGradeReq {
  studentId: number;
  courseId: number;
  grade: Grade;
}

export interface GradeChangeReq {
  enrollId: number;
  grade: Grade;
}

export interface EnrollmentChangeStatusReq {
  studentId: number;
  courseId: number;
  status: CourseStatus;
}

export interface StatusChangeReq {
  enrollId: number;
  status: CourseStatus;
}

export interface EnrollmentEditRequest {
  studentId: number;
  courseId: number;
  semester: number;
  status: CourseStatus;
  grade: Grade;
}