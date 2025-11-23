import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { 
  CourseResponse, 
  CourseCreationReq, 
  CourseUpdateReq 
} from '@/types/index';

interface CourseState {
  courses: CourseResponse[];
  currentCourse: CourseResponse | null;
  lecturerCourses: CourseResponse[];
  prerequisites: CourseResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  lecturerCourses: [],
  prerequisites: [],
  loading: false,
  error: null,
};

const baseUrl = "http://localhost:8080/api";


// GET /api/courses
export const getAllCourses = createAsyncThunk('courses/getAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<CourseResponse[]>(`${baseUrl}/courses`);
    return response.data;
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

// GET /api/courses/{courseId}
export const getCourseById = createAsyncThunk('courses/getById', async (courseId: number, { rejectWithValue }) => {
  try {
    const response = await axios.get<CourseResponse>(`${baseUrl}/courses/${courseId}`);
    return response.data;
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

// GET /api/courses/by-lecturer/{lecturerId}
export const getLecturerCourses = createAsyncThunk('courses/getByLecturer', async (lecturerId: number, { rejectWithValue }) => {
  try {
    const response = await axios.get<CourseResponse[]>(`${baseUrl}/courses/by-lecturer/${lecturerId}`);
    return response.data;
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

// GET /api/courses/{courseId}/prerequisites
export const getCoursePrerequisites = createAsyncThunk('courses/getPrerequisites', async (courseId: number, { rejectWithValue }) => {
  try {
    const response = await axios.get<CourseResponse[]>(`${baseUrl}/courses/${courseId}/prerequisites`);
    return response.data;
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

// POST /api/courses
export const createCourse = createAsyncThunk('courses/create', async (data: CourseCreationReq, { rejectWithValue }) => {
  try {
    const response = await axios.post<CourseResponse>(`${baseUrl}/courses`, data);
    return response.data;
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

// POST /api/courses/create/withPrerequisites
export const createCourseWithPrerequisites = createAsyncThunk('courses/createWithPrereq', async (data: CourseCreationReq, { rejectWithValue }) => {
  try {
    const response = await axios.post<CourseResponse>(`${baseUrl}/courses/create/withPrerequisites`, data);
    return response.data;
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

// POST /api/courses/{courseId}/prerequisites
export const addPrerequisite = createAsyncThunk('courses/addPrereq', async ({ courseId, prereqId }: { courseId: number; prereqId: number }, { rejectWithValue }) => {
  try {
    const response = await axios.post<CourseResponse>(`${baseUrl}/courses/${courseId}/prerequisites`, prereqId, {
        headers: { 'Content-Type': 'application/json' } // Sending Long as body usually requires specific handling or simple JSON
    });
    return response.data;
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

// PATCH /api/courses/{courseId}
export const editCourse = createAsyncThunk('courses/edit', async ({ courseId, data }: { courseId: number; data: CourseUpdateReq }, { rejectWithValue }) => {
  try {
    const response = await axios.patch<CourseResponse>(`${baseUrl}/courses/${courseId}`, data);
    return response.data;
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

// DELETE /api/courses/{courseId}
export const deleteCourse = createAsyncThunk('courses/delete', async (courseId: number, { rejectWithValue }) => {
  try {
    await axios.delete(`${baseUrl}/courses/${courseId}`);
    return courseId;
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearCurrentCourse: (state) => { state.currentCourse = null; },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(getAllCourses.pending, (state) => { state.loading = true; })
      .addCase(getAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(getAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get One
      .addCase(getCourseById.fulfilled, (state, action) => {
        state.currentCourse = action.payload;
      })
      // Get Lecturer Courses
      .addCase(getLecturerCourses.fulfilled, (state, action) => {
        state.lecturerCourses = action.payload;
      })
      // Get Prereqs
      .addCase(getCoursePrerequisites.fulfilled, (state, action) => {
        state.prerequisites = action.payload;
      })
      // Create
      .addCase(createCourse.fulfilled, (state, action) => {
        state.courses.push(action.payload);
      })
      .addCase(createCourseWithPrerequisites.fulfilled, (state, action) => {
        state.courses.push(action.payload);
      })
      // Update
      .addCase(editCourse.fulfilled, (state, action) => {
        const index = state.courses.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.courses[index] = action.payload;
        state.currentCourse = action.payload;
      })
      // Delete
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter(c => c.id !== action.payload);
      })

      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action: PayloadAction<string>) =>{
          state.loading = false;
          state.error = action.payload ;
        }
      )
  },
});

export const { clearCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;