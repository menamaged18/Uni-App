// lecturer.tsx
'use client';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/services/store/storeHooks';
import { getLecturerCourses } from '@/services/reducers/CourseReducer';
import { 
  getCourseEnrollments, 
  changeEnrollmentGrade,
  changeEnrollmentStatus,
  courseEnrollmentsNumber
} from '@/services/reducers/EnrollmentReducer';
import { CourseResponse, CourseStatus, Grade, GradeChangeReq, StatusChangeReq } from '@/types';
import { gradeLabels, statusLabels, sortedGrades } from '@/types/labels';

const Lecturer = () => {
  const dispatch = useAppDispatch();
  const { lecturerCourses, loading, error } = useAppSelector(state => state.courses);
  const { courseEnrollments, loading: enrollmentsLoading } = useAppSelector(state => state.enrollments);
  const {data:lecturer} = useAppSelector(state => state.users.currentUser);
  
  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(null);
  const [gradeEdit, setGradeEdit] = useState<{ [key: number]: Grade | '' }>({}); 
  const [statusEdit, setStatusEdit] = useState<{ [key: number]: CourseStatus | '' }>({}); 
  const [courseCounts, setCourseCounts] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    if(lecturer?.id){
        dispatch(getLecturerCourses(lecturer?.id));
    }
  }, [dispatch, lecturer]);

    useEffect(() => {
    if (lecturerCourses.length > 0) {
        lecturerCourses.forEach((course) => {
        // Only fetch if we don't have it yet 
        dispatch(courseEnrollmentsNumber(course.id))
            .unwrap()
            .then((count) => {
            setCourseCounts((prev) => ({
                ...prev,
                [course.id]: count,
            }));
            })
            .catch((err) => console.error("Failed to load count for course", course.id, err));
        });
    }
    }, [lecturerCourses, dispatch]);

  const handleCourseSelect = (course: CourseResponse) => {
    setSelectedCourse(course);
    dispatch(getCourseEnrollments(course.id));
  };

  const handleGradeChange = (enrollmentId: number, grade: Grade) => {
    const gradeChangeData: GradeChangeReq = {
      enrollId: enrollmentId,
      grade: grade
    };
    dispatch(changeEnrollmentGrade(gradeChangeData))
      .unwrap()
      .then(() => {
        // Refresh enrollments after grade change
        if (selectedCourse) {
          dispatch(getCourseEnrollments(selectedCourse.id));
        }
        // Clear edit state
        setGradeEdit(prev => ({ ...prev, [enrollmentId]: '' }));
      })
      .catch(console.error);
  };

  const handleStatusChange = (enrollmentId: number, status: CourseStatus) => {
    const statusChangeData: StatusChangeReq = {
      enrollId: enrollmentId,
      status: status
    };
    dispatch(changeEnrollmentStatus(statusChangeData))
      .unwrap()
      .then(() => {
        // Refresh enrollments after status change
        if (selectedCourse) {
          dispatch(getCourseEnrollments(selectedCourse.id));
        }
        // Clear edit state
        setStatusEdit(prev => ({ ...prev, [enrollmentId]: '' }));
      })
      .catch(console.error);
  };

  const getGradeColor = (grade: Grade | null) => {
    if (!grade) return 'text-gray-500';
    
    // Use the gradeLabels for comparison instead of numeric values
    const gradeValue = gradeLabels[grade];
    if (gradeValue === "A+" || gradeValue === "A" || gradeValue === "A-") return 'text-green-600';
    if (gradeValue === "B+" || gradeValue === "B" || gradeValue === "B-") return 'text-blue-600';
    if (gradeValue === "C+" || gradeValue === "C" || gradeValue === "C-") return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: CourseStatus) => {
    const statusColors = {
      [CourseStatus.InProgress]: 'bg-green-100 text-green-800',
      [CourseStatus.Completed]: 'bg-blue-100 text-blue-800',
      [CourseStatus.Dropped]: 'bg-red-100 text-red-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  // Helper function to display grade using gradeLabels
  const displayGrade = (grade: Grade | null) => {
    if (!grade) return 'N/A';
    return gradeLabels[grade];
  };

  // Helper function to display status using statusLabels
  const displayStatus = (status: CourseStatus) => {
    return statusLabels[status];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lecturer Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your courses and student enrollments
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course List */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Your Courses</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {lecturerCourses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => handleCourseSelect(course)}
                    className={`w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedCourse?.id === course.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{course.name}</h3>
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-4 shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {courseCounts[course.id] !== undefined ? courseCounts[course.id] : '-'} students
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
                {lecturerCourses.length === 0 && (
                  <div className="px-6 py-8 text-center">
                    <p className="text-sm text-gray-500">No courses assigned</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enrollment List */}
          <div className="lg:col-span-2">
            {selectedCourse ? (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        Enrollments - {selectedCourse.name}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Manage student grades and enrollment status
                      </p>
                    </div>
                  </div>
                </div>

                {enrollmentsLoading ? (
                  <div className="px-6 py-8 text-center">
                    <div className="text-sm text-gray-500">Loading enrollments...</div>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Semester
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Grade
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {courseEnrollments.map((enrollment) => (
                          <tr key={enrollment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {enrollment.studentName || `Student ${enrollment.studentId}`}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {enrollment.studentId}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {enrollment.semester}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(enrollment.status)}`}>
                                  {displayStatus(enrollment.status)}
                                </span>
                                <select
                                  value={statusEdit[enrollment.id] || ''}
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleStatusChange(enrollment.id, e.target.value as CourseStatus);
                                    }
                                  }}
                                  className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                  <option value="">Change</option>
                                  <option value={CourseStatus.InProgress}>{statusLabels[CourseStatus.InProgress]}</option>
                                  <option value={CourseStatus.Completed}>{statusLabels[CourseStatus.Completed]}</option>
                                  <option value={CourseStatus.Dropped}>{statusLabels[CourseStatus.Dropped]}</option>
                                </select>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <span className={`text-sm font-medium ${getGradeColor(enrollment.grade)}`}>
                                  {displayGrade(enrollment.grade)}
                                </span>
                                <select
                                  value={gradeEdit[enrollment.id] || ''}
                                  onChange={(e) => setGradeEdit(prev => ({
                                    ...prev,
                                    [enrollment.id]: e.target.value as Grade
                                  }))}
                                  className="text-sm w-20 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                  <option value="">Set grade</option>
                                  {sortedGrades.map(grade => (
                                    <option key={grade} value={grade}>
                                      {gradeLabels[grade]}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => {
                                  if (gradeEdit[enrollment.id]) {
                                    handleGradeChange(enrollment.id, gradeEdit[enrollment.id] as Grade);
                                  }
                                }}
                                disabled={!gradeEdit[enrollment.id]}
                                className="text-blue-600 hover:text-blue-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                              >
                                Update Grade
                              </button>
                            </td>
                          </tr>
                        ))}
                        {courseEnrollments.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                              No enrollments found for this course
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Course</h3>
                <p className="text-sm text-gray-500">
                  Choose a course from the list to view and manage student enrollments
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lecturer;