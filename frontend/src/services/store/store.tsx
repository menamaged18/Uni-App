import { configureStore } from "@reduxjs/toolkit";
import courseReducer from '@/services/reducers/CourseReducer';
import EnrollmentReducer from '@/services/reducers/EnrollmentReducer';
import LectureTimeReducer from '@/services/reducers/LectureTimeReducer';
import UserReducer from '@/services/reducers/UserReducer';

export const store = configureStore({
    reducer: {
        users: UserReducer,
        courses: courseReducer,
        enrollments: EnrollmentReducer,
        lectureTime: LectureTimeReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;