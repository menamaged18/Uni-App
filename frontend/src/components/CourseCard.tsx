import React from 'react';
import Link from 'next/link';
import { CourseResponse } from '../types';

interface CourseCardProps {
  course: CourseResponse;
}

export default function CourseCard({ course }: CourseCardProps) {
  const isRegistrationOpen = () => {
    const now = new Date();
    const start = new Date(course.courseStartRegistirationDate);
    const end = new Date(course.courseEndRegistirationDate);
    return now >= start && now <= end;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
            {course.name}
          </h3>
          {isRegistrationOpen() && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Open
            </span>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">👨‍🏫</span>
            <span>{course.lecturerName}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">📅</span>
            <span>
              {formatDate(course.startDate)} - {formatDate(course.endDate)}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">⏰</span>
            <span>
              Registration: {formatDate(course.courseStartRegistirationDate)} - {formatDate(course.courseEndRegistirationDate)}
            </span>
          </div>

          {course.prerequisiteCoursesNames.length > 0 && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Prerequisites:</span>{' '}
              {course.prerequisiteCoursesNames.join(', ')}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <Link 
            href={`/course/${course.id}`}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View Details →
          </Link>
          
          {isRegistrationOpen() && (
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Enroll Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}