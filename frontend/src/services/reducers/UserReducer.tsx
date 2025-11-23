import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { User, UserCreationReq, LoginRequest, JwtResponse } from '@/types/index';

interface UsersStatus {
  data: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

interface UserStatus {
  data: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isAuthenticated: boolean;
  error: string | null;
  token: string | null;
}

interface UserState {
  students: UsersStatus;
  lecturers: UsersStatus;
  admins: UsersStatus;
  currentUser: UserStatus;
  selectedUser: User | null;
  operationStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const baseUrl = "http://localhost:8080/api";

const initialState: UserState = {
  students: {
    data: [],
    status: 'idle',
    error: null
  },
  lecturers: {
    data: [],
    status: 'idle',
    error: null
  },
  admins: {
    data: [],
    status: 'idle',
    error: null
  },
  currentUser: {
    data: null,
    status: 'idle',
    isAuthenticated: false,
    error: null,
    token: null
  },
  selectedUser: null,
  operationStatus: 'idle',
  error: null,
};

// POST /api/auth/login
export const loginUser = createAsyncThunk(
  'users/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post<JwtResponse>(`${baseUrl}/auth/login`, credentials);
      
      // Save token to localStorage so it persists on refresh
      localStorage.setItem('token', response.data.token);
      
      return response.data;
    } catch (err: any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue('Login failed: Server unreachable');
    }
  }
);

// GET Users by Role
export const getAllStudents = createAsyncThunk('users/getAllStudents', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<User[]>(`${baseUrl}/users/students`);
    return response.data;
  } catch (err: any) { 
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch students');
  }
});

export const getStudentsByName = createAsyncThunk('users/studentsByName', async (word:string, { rejectWithValue }) => {
  try {
    const response = await axios.get<User[]>(`${baseUrl}/users/studentsByName?searchWord=${encodeURIComponent(word)}`);
    return response.data;
  } catch (err: any) { 
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch students');
  }
});

export const getAllLecturers = createAsyncThunk('users/getAllLecturers', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<User[]>(`${baseUrl}/users/lecturers`);
    return response.data;
  } catch (err: any) { 
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch lecturers');
  }
});

export const getLecturersByName = createAsyncThunk('users/lecturByName', async (word: string, { rejectWithValue }) => {
  try {
    const response = await axios.get<User[]>(`${baseUrl}/users/lecturersByName?searchWord=${encodeURIComponent(word)}`);
    return response.data;
  } catch (err: any) { 
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch lecturers');
  }
});

export const getAllAdmins = createAsyncThunk('users/getAllAdmins', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<User[]>(`${baseUrl}/users/admins`);
    return response.data;
  } catch (err: any) { 
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch admins');
  }
});

export const getAdminsByName = createAsyncThunk('users/adminsByName', async (word: string, { rejectWithValue }) => {
  try {
    const response = await axios.get<User[]>(`${baseUrl}/users/adminsByName?searchWord=${encodeURIComponent(word)}`);
    return response.data;
  } catch (err: any) { 
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch admins');
  }
});

// GET User by ID
export const getUserById = createAsyncThunk('users/getById', async ({ id, role }: { id: number; role: 'students' | 'lecturers' | 'admins' }, { rejectWithValue }) => {
  try {
    const response = await axios.get<User>(`${baseUrl}/users/${role}/${id}`);
    return response.data;
  } catch (err: any) { 
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
  }
});

// CREATE Users
export const createStudent = createAsyncThunk('users/createStudent', async (data: UserCreationReq, { rejectWithValue }) => {
  try {
    const response = await axios.post<User>(`${baseUrl}/users/students`, data);
    return response.data;
  } catch (err: any) { 
    return rejectWithValue(err.response?.data?.message || 'Failed to create student');
  }
});

export const createLecturer = createAsyncThunk('users/createLecturer', async (data: UserCreationReq, { rejectWithValue }) => {
  try {
    const response = await axios.post<User>(`${baseUrl}/users/lecturers`, data);
    return response.data;
  } catch (err: any) { 
    return rejectWithValue(err.response?.data?.message || 'Failed to create lecturer');
  }
});

export const createAdmin = createAsyncThunk('users/createAdmin', async (data: UserCreationReq, { rejectWithValue }) => {
  try {
    const response = await axios.post<User>(`${baseUrl}/users/admins`, data);
    return response.data;
  } catch (err: any) { 
    return rejectWithValue(err.response?.data?.message || 'Failed to create admin');
  }
});

// UPDATE Users
export const updateStudent = createAsyncThunk('users/updateStudent', async ({ id, data }: { id: number; data: Partial<UserCreationReq> }, { rejectWithValue }) => {
  try {
    const response = await axios.put<User>(`${baseUrl}/users/students/${id}`, data);
    return response.data;
  } catch (err: any) { 
    return rejectWithValue(err.response?.data?.message || 'Failed to update student');
  }
});

export const updateLecturer = createAsyncThunk('users/updateLecturer', async ({ id, data }: { id: number; data: Partial<UserCreationReq> }, { rejectWithValue }) => {
  try {
    const response = await axios.put<User>(`${baseUrl}/users/lecturers/${id}`, data);
    return response.data;
  } catch (err: any) { 
    return rejectWithValue(err.response?.data?.message || 'Failed to update lecturer');
  }
});

// DELETE Users
export const deleteStudent = createAsyncThunk('users/deleteStudent', async (id: number, { rejectWithValue }) => {
  try {
    await axios.delete(`${baseUrl}/users/students/${id}`);
    return id;
  } catch (err: any) { 
    return rejectWithValue(err.response?.data?.message || 'Failed to delete student');
  }
});

export const deleteLecturer = createAsyncThunk('users/deleteLecturer', async (id: number, { rejectWithValue }) => {
  try {
    await axios.delete(`${baseUrl}/users/lecturers/${id}`);
    return id;
  } catch (err: any) { 
    return rejectWithValue(err.response?.data?.message || 'Failed to delete lecturer');
  }
});

export const deleteAdmin = createAsyncThunk('users/deleteAdmin', async (id: number, { rejectWithValue }) => {
  try {
    await axios.delete(`${baseUrl}/users/admins/${id}`);
    return id;
  } catch (err: any) { 
    return rejectWithValue(err.response?.data?.message || 'Failed to delete admin');
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    logout: (state) => { 
      state.currentUser.data = null;
      state.currentUser.token = null;
      state.currentUser.status = 'idle';
      state.currentUser.error = null;
      state.currentUser.isAuthenticated = false;
      
      // Remove token from storage
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
      state.students.error = null;
      state.lecturers.error = null;
      state.admins.error = null;
    },
    resetOperationStatus: (state) => {
      state.operationStatus = 'idle';
    },
    clearStudentStatus: (state) =>{
      state.students.data = [];
      state.students.error = null;
      state.students.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // --- LOGIN CASES ---
      .addCase(loginUser.pending, (state) => {
        state.currentUser.status = 'loading';
        state.currentUser.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.currentUser.status = 'succeeded';
        state.currentUser.data = action.payload.user;
        state.currentUser.isAuthenticated = true;
        state.currentUser.token = action.payload.token;
        state.currentUser.error = null;
      })
      // Fetch lists - Students
      .addCase(getAllStudents.pending, (state) => {
        state.students.status = 'loading';
      })
      .addCase(getAllStudents.fulfilled, (state, action) => {
        state.students.status = 'succeeded';
        state.students.data = action.payload;
      })
      .addCase(getAllStudents.rejected, (state, action) => {
        state.students.status = 'failed';
        state.students.error = action.payload as string;
      })

      // Students by name
      .addCase(getStudentsByName.pending, (state) => {
        state.students.status = 'loading';
      })
      .addCase(getStudentsByName.fulfilled, (state, action) => {
        state.students.status = 'succeeded';
        state.students.data = action.payload;
      })
      .addCase(getStudentsByName.rejected, (state, action) => {
        state.students.status = 'failed';
        state.students.error = action.payload as string;
      })
      
      // Fetch lists - Lecturers
      .addCase(getAllLecturers.pending, (state) => {
        state.lecturers.status = 'loading';
      })
      .addCase(getAllLecturers.fulfilled, (state, action) => {
        state.lecturers.status = 'succeeded';
        state.lecturers.data = action.payload;
      })
      .addCase(getAllLecturers.rejected, (state, action) => {
        state.lecturers.status = 'failed';
        state.lecturers.error = action.payload as string;
      })
      
      // lecturers by name
      .addCase(getLecturersByName.pending, (state) => {
        state.lecturers.status = 'loading';
      })
      .addCase(getLecturersByName.fulfilled, (state, action) => {
        state.lecturers.status = 'succeeded';
        state.lecturers.data = action.payload;
      })
      .addCase(getLecturersByName.rejected, (state, action) => {
        state.lecturers.status = 'failed';
        state.lecturers.error = action.payload as string;
      })

      // Fetch lists - Admins
      .addCase(getAllAdmins.pending, (state) => {
        state.admins.status = 'loading';
      })
      .addCase(getAllAdmins.fulfilled, (state, action) => {
        state.admins.status = 'succeeded';
        state.admins.data = action.payload;
      })
      .addCase(getAllAdmins.rejected, (state, action) => {
        state.admins.status = 'failed';
        state.admins.error = action.payload as string;
      })

      // admins by name
      .addCase(getAdminsByName.pending, (state) => {
        state.admins.status = 'loading';
      })
      .addCase(getAdminsByName.fulfilled, (state, action) => {
        state.admins.status = 'succeeded';
        state.admins.data = action.payload;
      })
      .addCase(getAdminsByName.rejected, (state, action) => {
        state.admins.status = 'failed';
        state.admins.error = action.payload as string;
      })
      
      // Get Single User
      .addCase(getUserById.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.operationStatus = 'succeeded';
        state.selectedUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.error = action.payload as string;
      })
      
      // Create Student
      .addCase(createStudent.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.operationStatus = 'succeeded';
        state.students.data.push(action.payload);
      })
      
      // Create Lecturer
      .addCase(createLecturer.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(createLecturer.fulfilled, (state, action) => {
        state.operationStatus = 'succeeded';
        state.lecturers.data.push(action.payload);
      })
      
      // Create Admin
      .addCase(createAdmin.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.operationStatus = 'succeeded';
        state.admins.data.push(action.payload);
      })
      
      // Update Student
      .addCase(updateStudent.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.operationStatus = 'succeeded';
        const index = state.students.data.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.students.data[index] = action.payload;
        }
        // Also update currentUser if it's the same user
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      })
      
      // Update Lecturer
      .addCase(updateLecturer.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(updateLecturer.fulfilled, (state, action) => {
        state.operationStatus = 'succeeded';
        const index = state.lecturers.data.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.lecturers.data[index] = action.payload;
        }
      })
      
      // Delete Student
      .addCase(deleteStudent.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.operationStatus = 'succeeded';
        state.students.data = state.students.data.filter(user => user.id !== action.payload);
        // Clear currentUser if it's the deleted user
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
      })
      
      // Delete Lecturer
      .addCase(deleteLecturer.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(deleteLecturer.fulfilled, (state, action) => {
        state.operationStatus = 'succeeded';
        state.lecturers.data = state.lecturers.data.filter(user => user.id !== action.payload);
      })
      
      // Delete Admin
      .addCase(deleteAdmin.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.operationStatus = 'succeeded';
        state.admins.data = state.admins.data.filter(user => user.id !== action.payload);
      })

      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action: PayloadAction<string>) => {
          state.operationStatus = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export const { logout, clearError, resetOperationStatus, clearStudentStatus} = userSlice.actions;
export default userSlice.reducer;