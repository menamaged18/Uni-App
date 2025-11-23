// src/app/enrolled-courses/page.tsx
"use client"
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/services/store/storeHooks';
import { getStudentEnrollments } from '@/services/reducers/EnrollmentReducer';
import Link from 'next/link';
import { CourseStatus, Grade } from '@/types/index';

export default function EnrolledCoursesPage() {
  const dispatch = useAppDispatch();
  const { studentEnrollments, loading, error } = useAppSelector(state => state.enrollments);
  const { data: user } = useAppSelector(state => state.users.currentUser); // Changed from selectedUser to currentUser
  const [filter, setFilter] = useState<CourseStatus | 'ALL'>('ALL');
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (user?.id && user.role === 'STUDENT') {
        try {
          setLocalLoading(true);
          await dispatch(getStudentEnrollments(user.id)).unwrap();
        } catch (err) {
          console.error('Failed to fetch enrollments:', err);
        } finally {
          setLocalLoading(false);
        }
      } else {
        setLocalLoading(false);
      }
    };

    fetchEnrollments();
  }, [dispatch, user]);

  // Use localLoading to prevent infinite loading
  const isLoading = localLoading || (loading && studentEnrollments.length === 0);

  const filteredEnrollments = filter === 'ALL' 
    ? studentEnrollments 
    : studentEnrollments.filter(enrollment => enrollment.status === filter);

  const getStatusColor = (status: CourseStatus) => {
    switch (status) {
      case CourseStatus.InProgress:
        return 'bg-blue-100 text-blue-800';
      case CourseStatus.Completed:
        return 'bg-green-100 text-green-800';
      case CourseStatus.Dropped:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade: Grade) => {
    if (grade.includes('A')) return 'bg-green-100 text-green-800';
    if (grade.includes('B')) return 'bg-blue-100 text-blue-800';
    if (grade.includes('C')) return 'bg-yellow-100 text-yellow-800';
    if (grade.includes('D')) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateGPA = () => {
    const completedCourses = studentEnrollments.filter(
      enrollment => enrollment.status === CourseStatus.Completed && enrollment.grade !== Grade.F
    );

    if (completedCourses.length === 0) return 0;

    const gradePoints: { [key in Grade]?: number } = {
      [Grade.A_PLUS]: 4.0,
      [Grade.A]: 4.0,
      [Grade.A_MINUS]: 3.7,
      [Grade.B_PLUS]: 3.3,
      [Grade.B]: 3.0,
      [Grade.B_MINUS]: 2.7,
      [Grade.C_PLUS]: 2.3,
      [Grade.C]: 2.0,
      [Grade.C_MINUS]: 1.7,
      [Grade.D_PLUS]: 1.3,
      [Grade.D]: 1.0,
      [Grade.D_MINUS]: 0.7,
      [Grade.F]: 0.0
    };

    const totalPoints = completedCourses.reduce((sum, enrollment) => {
      return sum + (gradePoints[enrollment.grade] || 0);
    }, 0);

    return (totalPoints / completedCourses.length).toFixed(2);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h1>
          <p className="text-gray-600 mb-4">Please log in to view your enrolled courses.</p>
          <Link 
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'STUDENT') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">This page is only accessible to students.</p>
          <Link 
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your enrolled courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Courses</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => user?.id && dispatch(getStudentEnrollments(user.id))}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Enrolled Courses</h1>
              <p className="text-gray-600 mt-2">
                Manage and track your course progress
              </p>
            </div>
            <Link 
              href="/courses"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Browse More Courses
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-2xl font-bold text-gray-900">{studentEnrollments.length}</div>
              <div className="text-sm text-gray-600">Total Courses</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-2xl font-bold text-blue-600">
                {studentEnrollments.filter(e => e.status === CourseStatus.InProgress).length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-2xl font-bold text-green-600">
                {studentEnrollments.filter(e => e.status === CourseStatus.Completed).length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-2xl font-bold text-gray-900">{calculateGPA()}</div>
              <div className="text-sm text-gray-600">Current GPA</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                filter === 'ALL' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Courses
            </button>
            <button
              onClick={() => setFilter(CourseStatus.InProgress)}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                filter === CourseStatus.InProgress
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter(CourseStatus.Completed)}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                filter === CourseStatus.Completed
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter(CourseStatus.Dropped)}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                filter === CourseStatus.Dropped
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Dropped
            </button>
          </div>
        </div>

        {/* Courses List */}
        {filteredEnrollments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'ALL' ? 'No enrolled courses' : `No ${filter.toLowerCase()} courses`}
            </h3>
            <p className="text-gray-600 mb-4">
              {filter === 'ALL' 
                ? "You haven't enrolled in any courses yet." 
                : `You don't have any ${filter.toLowerCase()} courses.`
              }
            </p>
            <Link 
              href="/courses"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium inline-block"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {enrollment.courseName}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}>
                      {enrollment.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📅</span>
                      <span>Enrolled: {formatDate(enrollment.enrollmentDate)}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">🎓</span>
                      <span>Semester: {enrollment.semester}</span>
                    </div>

                    {enrollment.status === CourseStatus.Completed && enrollment.grade && (
                      <div className="flex items-center text-sm">
                        <span className="mr-2">📊</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getGradeColor(enrollment.grade)}`}>
                          Grade: {enrollment.grade.replace('_', ' ')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <Link 
                      href={`/course/${enrollment.courseId}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      View Course →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Progress Summary */}
        {studentEnrollments.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Course Status Distribution</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span className="text-sm ">In Progress</span>
                    <span className="text-sm font-medium">
                      {studentEnrollments.filter(e => e.status === CourseStatus.InProgress).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="text-smtext-gray-600">Completed</span>
                    <span className="text-sm font-medium">
                      {studentEnrollments.filter(e => e.status === CourseStatus.Completed).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="text-sm">Dropped</span>
                    <span className="text-sm font-medium">
                      {studentEnrollments.filter(e => e.status === CourseStatus.Dropped).length}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span className="text-sm ">Current GPA</span>
                    <span className="text-sm font-medium ">{calculateGPA()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="text-sm">Completed Courses</span>
                    <span className="text-sm font-medium">
                      {studentEnrollments.filter(e => e.status === CourseStatus.Completed).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="text-sm">Success Rate</span>
                    <span className="text-sm font-medium">
                      {studentEnrollments.length > 0 
                        ? Math.round(
                            (studentEnrollments.filter(e => e.status === CourseStatus.Completed).length / 
                            studentEnrollments.length) * 100
                          ) 
                        : 0
                      }%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}