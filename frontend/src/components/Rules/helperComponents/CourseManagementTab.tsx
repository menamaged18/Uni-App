import { CourseResponse } from "@/types";
import Link from "next/link";

interface CourseManagementTabProps {
  courses: CourseResponse[];
  loading: boolean;
  onDelete: (id: number) => void;
  onCreate: () => void;
  canCreate: boolean;
  canDelete: boolean;
}

export default function CourseManagementTab({ courses, loading, onDelete, onCreate, canCreate, canDelete }: CourseManagementTabProps) {
  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Courses</h2>
        {canCreate && (
          <button
            onClick={onCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer"
          >
            Create Course
          </button>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lecturer
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th> */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {course.lecturerName || 'No lecturer'}
                </td>
                {/* TODO: make course active and inactive */}
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    course.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {course.active ? 'Active' : 'Inactive'}
                  </span>
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex">
                  <Link
                    href={`/courseEnrollments/${course.id}`}
                    className="text-blue-600 hover:text-blue-900 flex-1"
                  >
                    View Enrollments
                  </Link>
                  {canDelete && (
                    <button
                      onClick={() => onDelete(course.id)}
                      className="text-red-600 hover:text-red-900 text-center flex-1"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}