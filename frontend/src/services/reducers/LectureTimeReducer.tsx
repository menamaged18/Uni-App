import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { LectureTimeRequest, LectureTimeResponse } from '@/types/index';

// Note: The Java code mentions LectureTimeResponse2 but the TS file only has LectureTimeResponse.
// I will use an extended interface to accommodate potential extra fields (like courseName) from Response2
interface LectureTimeResponse2 extends LectureTimeResponse {
    courseId?: number;
    courseName?: string;
}

interface LectureTimeState {
  allLectureTimes: LectureTimeResponse2[];
  courseLectureTimes: LectureTimeResponse[];
  dayLectureTimes: LectureTimeResponse2[];
  currentLectureTime: LectureTimeResponse2 | null;
  loading: boolean;
  error: string | null;
}

const initialState: LectureTimeState = {
  allLectureTimes: [],
  courseLectureTimes: [],
  dayLectureTimes: [],
  currentLectureTime: null,
  loading: false,
  error: null,
};

// GET /api/lecture-times
export const getAllLectureTimes = createAsyncThunk('lectureTime/getAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<LectureTimeResponse2[]>('/api/lecture-times');
    return response.data;
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

// GET /api/lecture-times/course/{courseId}
export const getCourseLectureTimes = createAsyncThunk('lectureTime/getByCourse', async (courseId: number, { rejectWithValue }) => {
  try {
    const response = await axios.get<LectureTimeResponse[]>(`/api/lecture-times/course/${courseId}`);
    return response.data;
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

// GET /api/lecture-times/day/{day}
export const getDayLectureTimes = createAsyncThunk('lectureTime/getByDay', async (day: string, { rejectWithValue }) => {
  try {
    const response = await axios.get<LectureTimeResponse2[]>(`/api/lecture-times/day/${day}`);
    return response.data;
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

// GET /api/lecture-times/{lectureTimeId}
export const getLectureTimeById = createAsyncThunk('lectureTime/getById', async (id: number, { rejectWithValue }) => {
  try {
    const response = await axios.get<LectureTimeResponse2>(`/api/lecture-times/${id}`);
    return response.data;
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

// POST /api/lecture-times
export const addLectureTime = createAsyncThunk('lectureTime/add', async (data: LectureTimeRequest, { rejectWithValue }) => {
  try {
    const response = await axios.post<LectureTimeResponse>('/api/lecture-times', data);
    return response.data;
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

// DELETE /api/lecture-times/{lectureTimeId}
export const deleteLectureTime = createAsyncThunk('lectureTime/delete', async (id: number, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/lecture-times/${id}`);
    return id;
  } catch (err: any) { return rejectWithValue(err.response?.data); }
});

const lectureTimeSlice = createSlice({
  name: 'lectureTime',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllLectureTimes.pending, (state) => { state.loading = true; })
      .addCase(getAllLectureTimes.fulfilled, (state, action) => {
        state.loading = false;
        state.allLectureTimes = action.payload;
      })
      .addCase(getCourseLectureTimes.fulfilled, (state, action) => {
        state.courseLectureTimes = action.payload;
      })
      .addCase(getDayLectureTimes.fulfilled, (state, action) => {
        state.dayLectureTimes = action.payload;
      })
      .addCase(addLectureTime.fulfilled, (state, action) => {
        // Type assertion used because response might be stricter than Response2
        state.courseLectureTimes.push(action.payload);
      })
      .addCase(deleteLectureTime.fulfilled, (state, action) => {
        state.allLectureTimes = state.allLectureTimes.filter(lt => lt.id !== action.payload);
        state.courseLectureTimes = state.courseLectureTimes.filter(lt => lt.id !== action.payload);
        state.dayLectureTimes = state.dayLectureTimes.filter(lt => lt.id !== action.payload);
      });
  },
});

export default lectureTimeSlice.reducer;