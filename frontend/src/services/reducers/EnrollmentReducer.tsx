import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { 
  EnrollmentResponse, 
  StudentEnrollmentsResponse, 
  EnrollmentRequest, 
  EnrollmentEditRequest, 
  GradeChangeReq,
  StatusChangeReq
} from '@/types/index';

interface EnrollmentState {
  studentEnrollments: StudentEnrollmentsResponse[];
  courseEnrollments: EnrollmentResponse[];
  currentEnrollment: EnrollmentResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: EnrollmentState = {
  studentEnrollments: [],
  courseEnrollments: [],
  currentEnrollment: null,
  loading: false,
  error: null,
};

const baseUrl = "http://localhost:8080/api";

// GET /api/enrollments/student/{studentId}
export const getStudentEnrollments = createAsyncThunk('enrollments/getByStudent', async (studentId: number, { rejectWithValue }) => {
  try {
    const response = await axios.get<StudentEnrollmentsResponse[]>(`${baseUrl}/enrollments/student/${studentId}`);
    return response.data;
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

// GET /api/enrollments/course/{courseId}
export const getCourseEnrollments = createAsyncThunk('enrollments/getByCourse', async (courseId: number, { rejectWithValue }) => {
  try {
    const response = await axios.get<EnrollmentResponse[]>(`${baseUrl}/enrollments/course/${courseId}`);
    return response.data;
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

// GET /api/enrollments/{enrollmentId}
export const getEnrollmentById = createAsyncThunk('enrollments/getById', async (id: number, { rejectWithValue }) => {
  try {
    const response = await axios.get<EnrollmentResponse>(`${baseUrl}/enrollments/${id}`);
    return response.data;
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

export const courseEnrollmentsNumber = createAsyncThunk('enrollments/CourseEnrollments', async (courseId: number, {rejectWithValue}) => {
  try{
    const response = await axios.get<number>(`${baseUrl}/enrollments/${courseId}/count`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);     
    }
    return rejectWithValue(error); 
  }
});

// POST /api/enrollments
export const createEnrollment = createAsyncThunk('enrollments/create', async (data: EnrollmentRequest, { rejectWithValue }) => {
  try {
    const response = await axios.post<EnrollmentResponse>(`${baseUrl}/enrollments`, data);
    return response.data;
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

// POST /api/enrollments/after-due
export const createEnrollmentAfterDue = createAsyncThunk('enrollments/createAfterDue', async (data: EnrollmentRequest, { rejectWithValue }) => {
  try {
    const response = await axios.post<EnrollmentResponse>(`${baseUrl}/enrollments/after-due`, data);
    return response.data;
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

// PUT /api/enrollments/status
export const changeEnrollmentStatus = createAsyncThunk('enrollments/changeStatus', async (data: StatusChangeReq, { rejectWithValue }) => {
  try {
    await axios.put(`${baseUrl}/enrollments/status`, data);
    return data; 
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

// export const changeEnrollmentStatusByStudentAndCourseId = createAsyncThunk('enrollments/changeStatus', async (data: EnrollmentChangeStatusReq, { rejectWithValue }) => {
//   try {
//     await axios.put(`${baseUrl}/enrollments/status`, data);
//     return data; 
//   } catch (err: any) { return rejectWithValue(err.response?.data); }
// });

// PUT /api/enrollments/grade
export const changeEnrollmentGrade = createAsyncThunk('enrollments/changeGrade', async (data: GradeChangeReq, { rejectWithValue }) => {
  try {
    await axios.put(`${baseUrl}/enrollments/grade`, data);
    return data;
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

// export const setGradeByStudentAndCourseId = createAsyncThunk('enrollments/changeGrade', async (data: EnrollmentChangeGradeReq, { rejectWithValue }) => {
//   try {
//     await axios.put(`${baseUrl}/enrollments/grade`, data);
//     return data;
//   } catch (err: any) { return rejectWithValue(err.response?.data); }
// });

// PUT /api/enrollments/{enrollmentId}
export const editEnrollment = createAsyncThunk('enrollments/edit', async ({ id, data }: { id: number; data: EnrollmentEditRequest }, { rejectWithValue }) => {
  try {
    const response = await axios.put<EnrollmentResponse>(`${baseUrl}/enrollments/${id}`, data);
    return response.data;
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

// DELETE /api/enrollments/{enrollmentId}
export const deleteEnrollment = createAsyncThunk('enrollments/delete', async (id: number, { rejectWithValue }) => {
  try {
    await axios.delete(`${baseUrl}/enrollments/${id}`);
    return id;
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

const enrollmentSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStudentEnrollments.pending, (state) => { state.loading = true; })
      .addCase(getStudentEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.studentEnrollments = action.payload;
      })
      .addCase(getCourseEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.courseEnrollments = action.payload;
      })
      .addCase(getEnrollmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEnrollment = action.payload;
      })
      .addCase(deleteEnrollment.fulfilled, (state, action) => {
        state.loading = false;
        state.courseEnrollments = state.courseEnrollments.filter(e => e.id !== action.payload);
        // Note: StudentEnrollmentsResponse usually doesn't have the ID of the enrollment easily accessible for filtering 
        // depending on how the backend maps it, but assuming 'id' matches:
        state.studentEnrollments = state.studentEnrollments.filter(e => e.id !== action.payload);
      })
      .addCase(courseEnrollmentsNumber.fulfilled, (state) => {
        state.loading = false;
      })
      // add matchers for failing and loading status 
      .addMatcher( 
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action: PayloadAction<String>) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      )
  },
});

export default enrollmentSlice.reducer;