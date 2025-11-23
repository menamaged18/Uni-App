'use client'
import { useState, useEffect } from 'react';
import Head from 'next/head';
import CourseCard from '@/components/CourseCard';
import { useAppDispatch, useAppSelector } from '@/services/store/storeHooks';
import { getAllCourses } from '@/services/reducers/CourseReducer';

export default function Courses() {
  const dispatch = useAppDispatch();
  const {courses, error, loading} = useAppSelector(state => state.courses)
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getAllCourses());
  }, []);
  
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.name.toLowerCase().includes(searchTerm.toLowerCase())  
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Courses - UniSystem</title>
      </Head>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Course Catalog</h1>
          <p className="mt-2 text-gray-600">
            Discover all available courses and start your learning journey
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search courses or lecturers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <span className="text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm ? 'Try adjusting your search terms' : 'No courses available at the moment'}
            </p>
          </div>
        )}
      </div>
    </>
  );
}