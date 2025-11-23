// import { 
//   CourseResponse, 
//   CourseCreationReq, 
//   CourseUpdateReq,
//   EnrollmentRequest,
//   EnrollmentResponse,
//   StudentEnrollmentsResponse,
//   LoginRequest,
//   User,
//   UserCreationReq
// } from '../types';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

// class ApiService {
//   private async request(endpoint: string, options: RequestInit = {}) {
//     const token = localStorage.getItem('authToken');
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         ...(token && { Authorization: `Bearer ${token}` }),
//         ...options.headers,
//       },
//       ...options,
//     };

//     const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
//     if (!response.ok) {
//       throw new Error(`API error: ${response.statusText}`);
//     }
    
//     return response.json();
//   }

//   // Auth endpoints
//   async login(credentials: LoginRequest): Promise<{ token: string; user: User }> {
//     return this.request('/auth/login', {
//       method: 'POST',
//       body: JSON.stringify(credentials),
//     });
//   }

//   async register(userData: UserCreationReq): Promise<User> {
//     return this.request('/auth/register', {
//       method: 'POST',
//       body: JSON.stringify(userData),
//     });
//   }

//   // Course endpoints
//   async getCourses(): Promise<CourseResponse[]> {
//     return this.request('/courses');
//   }

//   async getCourse(id: number): Promise<CourseResponse> {
//     return this.request(`/courses/${id}`);
//   }

//   async createCourse(courseData: CourseCreationReq): Promise<CourseResponse> {
//     return this.request('/courses', {
//       method: 'POST',
//       body: JSON.stringify(courseData),
//     });
//   }

//   async updateCourse(id: number, courseData: CourseUpdateReq): Promise<CourseResponse> {
//     return this.request(`/courses/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(courseData),
//     });
//   }

//   // Enrollment endpoints
//   async enroll(courseId: number, semester: number): Promise<EnrollmentResponse> {
//     return this.request('/enrollments', {
//       method: 'POST',
//       body: JSON.stringify({ courseId, semester }),
//     });
//   }

//   async getMyEnrollments(): Promise<StudentEnrollmentsResponse[]> {
//     return this.request('/enrollments/me');
//   }

//   async updateEnrollmentGrade(enrollmentId: number, grade: string): Promise<EnrollmentResponse> {
//     return this.request(`/enrollments/${enrollmentId}/grade`, {
//       method: 'PATCH',
//       body: JSON.stringify({ grade }),
//     });
//   }
// }

// export const apiService = new ApiService();