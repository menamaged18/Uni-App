// src/app/course/[courseId]/page.tsx
"use client"
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/services/store/storeHooks';
import { getCourseById } from '@/services/reducers/CourseReducer';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default function CoursePage({ params }: PageProps) {
  const [resolvedParams, setResolvedParams] = React.useState<{ courseId: string } | null>(null);
  const dispatch = useAppDispatch();
  const { currentCourse, loading, error } = useAppSelector(state => state.courses);

  // Resolve the async params
  useEffect(() => {
    async function resolveParams() {
      const resolved = await params;
      setResolvedParams(resolved);
    }
    resolveParams();
  }, [params]);

  // Fetch course data when params are resolved
  useEffect(() => {
    if (resolvedParams?.courseId) {
      const courseId = parseInt(resolvedParams.courseId);
      if (!isNaN(courseId)) {
        dispatch(getCourseById(courseId));
      }
    }
  }, [resolvedParams, dispatch]);

  console.log(currentCourse);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Course</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link 
            href="/courses" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
          <p className="text-gray-600 mb-4">The requested course could not be found.</p>
          <Link 
            href="/courses" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const isRegistrationOpen = () => {
    const now = new Date();
    const start = new Date(currentCourse.courseStartRegistirationDate);
    const end = new Date(currentCourse.courseEndRegistirationDate);
    return now >= start && now <= end;
  };

  console.log(currentCourse);
  console.log(currentCourse.lecturerName);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link 
            href="/courses" 
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            ← Back to Courses
          </Link>
        </nav>

        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentCourse.name}
              </h1>
              <p className="text-gray-600">
                Course ID: {currentCourse.id}
              </p>
            </div>
            {isRegistrationOpen() && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Registration Open
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="flex items-center">
              <span className="mr-3 text-2xl">👨‍🏫</span>
              <div>
                <p className="text-sm text-black">Lecturer</p>
                <p className="font-medium text-gray-600">{currentCourse.lecturerName}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="mr-3 text-2xl">📅</span>
              <div>
                <p className="text-sm text-black">Duration</p>
                <p className="font-medium text-gray-600">
                  {formatDate(currentCourse.startDate)} - {formatDate(currentCourse.endDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <span className="mr-3 text-2xl">⏰</span>
              <div>
                <p className="text-sm text-black">Registration</p>
                <p className="font-medium text-gray-600">
                  {formatDate(currentCourse.courseStartRegistirationDate)} - {formatDate(currentCourse.courseEndRegistirationDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <span className="mr-3 text-2xl">📚</span>
              <div>
                <p className="text-sm text-black">Lectures</p>
                <p className="font-medium text-gray-600">{currentCourse.lecturesTime.length} sessions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lecture Times */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-black mb-4">
                Lecture Schedule
              </h2>
              {currentCourse.lecturesTime.length > 0 ? (
                <div className="space-y-3">
                  {currentCourse.lecturesTime.map((lecture, index) => (
                    <div key={lecture.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <span className="mr-4 text-lg">📅</span>
                        <div>
                          <p className="font-medium capitalize">{lecture.day.toLowerCase()}</p>
                          <p className="text-sm text-black">{formatTime(lecture.time)}</p>
                        </div>
                      </div>
                      <span className="text-sm text-black">Session {index + 1}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No lecture times scheduled yet.</p>
              )}
            </div>

            {/* Prerequisites */}
            {currentCourse.prerequisiteCoursesNames.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Prerequisites
                </h2>
                <div className="flex flex-wrap gap-2">
                  {currentCourse.prerequisiteCoursesNames.map((prereq, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {prereq}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Course Actions
              </h3>
              <div className="space-y-3">
                {isRegistrationOpen() ? (
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center">
                    <span className="mr-2">🎓</span>
                    Enroll in Course
                  </button>
                ) : (
                  <button 
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-md font-medium cursor-not-allowed flex items-center justify-center"
                  >
                    <span className="mr-2">⏳</span>
                    Registration Closed
                  </button>
                )}
                
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center">
                  <span className="mr-2">❤️</span>
                  Add to Wishlist
                </button>
                
                <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center">
                  <span className="mr-2">📧</span>
                  Contact Lecturer
                </button>
              </div>
            </div>

            {/* Course Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Course Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Course ID:</span>
                  <span className="font-medium text-gray-400">{currentCourse.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium text-gray-400">{formatDate(currentCourse.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Date:</span>
                  <span className="font-medium text-gray-400">{formatDate(currentCourse.endDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}