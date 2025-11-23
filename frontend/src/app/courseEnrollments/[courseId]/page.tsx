"use client"
import MakeEnroll from "@/components/Rules/helperComponents/MakeEnroll";
import { changeEnrollmentGrade, changeEnrollmentStatus, deleteEnrollment, getCourseEnrollments } from "@/services/reducers/EnrollmentReducer";
import { useAppDispatch, useAppSelector } from "@/services/store/storeHooks";
import { CourseStatus, Grade } from "@/types";
import { useParams } from 'next/navigation'
import { useEffect, useState } from "react";

// Human-readable labels
const gradeLabels: Record<Grade, string> = {
  [Grade.A_PLUS]: "A+",
  [Grade.A]: "A",
  [Grade.A_MINUS]: "A-",
  [Grade.B_PLUS]: "B+",
  [Grade.B]: "B",
  [Grade.B_MINUS]: "B-",
  [Grade.C_PLUS]: "C+",
  [Grade.C]: "C",
  [Grade.C_MINUS]: "C-",
  [Grade.D_PLUS]: "D+",
  [Grade.D]: "D",
  [Grade.D_MINUS]: "D-",
  [Grade.F]: "F",
};

const statusLabels: Record<CourseStatus, string> = {
  [CourseStatus.InProgress]: "In Progress",
  [CourseStatus.Dropped]: "Dropped",
  [CourseStatus.Completed]: "Completed",
};

// Sorted grades (best to worst)
const sortedGrades: Grade[] = [
  Grade.A_PLUS,
  Grade.A,
  Grade.A_MINUS,
  Grade.B_PLUS,
  Grade.B,
  Grade.B_MINUS,
  Grade.C_PLUS,
  Grade.C,
  Grade.C_MINUS,
  Grade.D_PLUS,
  Grade.D,
  Grade.D_MINUS,
  Grade.F,
];

export default function EnrollmentManagementTab() {
  const dispatch = useAppDispatch();
  const { courseId } = useParams();
  const [addModal, setAddModal] = useState(false);
  const {courseEnrollments:enrollments} = useAppSelector(state => state.enrollments)
  const {data:user} = useAppSelector(state => state.users.currentUser);

  useEffect(() => {
    dispatch(getCourseEnrollments(Number(courseId)));
  },[]);

  if ( user?.role === 'STUDENT') {
    return (
      <div className="p-6 text-center text-gray-500">
        Students are not allowed for this page
      </div>
    );
  }

  const onDelete = async (enrollId: number) =>{
    await dispatch(deleteEnrollment(enrollId));
    dispatch(getCourseEnrollments(Number(courseId)));
  }

  const onChangeGrade = async (enrollId: number, grade: Grade) =>{
    await dispatch(changeEnrollmentGrade({enrollId: enrollId, grade: grade}));
    dispatch(getCourseEnrollments(Number(courseId)));
  }

  const onChangeStatus = async (enrollmentId: number, status: CourseStatus) =>{
    await dispatch(changeEnrollmentStatus({enrollId: enrollmentId, status: status}));
    dispatch(getCourseEnrollments(Number(courseId)));
  }

  const onAddChange = async () =>{
    await dispatch(getCourseEnrollments(Number(courseId))).unwrap();
  }

  if (user?.role === undefined) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="text-lg font-semibold">Access Denied</h2>
          <p>You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {addModal &&
        <MakeEnroll 
          courseId={Number(courseId)} 
          onClose={() => setAddModal(false)}
          onAddChange={() => onAddChange()}
        />
      }
      <div className="flex justify-between font-semibold mb-4">
        <h2 className="text-xl">Course Enrollments</h2>
        {user?.role === 'SUPER_ADMIN' &&
          <button 
            className="mr-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer"
            onClick={() => setAddModal(true)}
          >
            Add Student
          </button>
        }
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
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
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {enrollment.studentName}
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ) ? (
                    <select
                      value={enrollment.status}
                      onChange={(e) =>
                        onChangeStatus(enrollment.id, e.target.value as CourseStatus)
                      }
                      className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.values(CourseStatus).map((status) => (
                        <option key={status} value={status}>
                          {statusLabels[status]}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="inline-block px-3 py-1 text-sm font-medium text-gray-700">
                      {statusLabels[enrollment.status as CourseStatus]}
                    </span>
                  )}
                </td>

                {/* Grade */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ) ? (
                    <select
                      value={enrollment.grade || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        onChangeGrade(
                          enrollment.id,
                          value as Grade
                        );
                      }}
                      className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">No Grade</option>
                      {sortedGrades.map((grade) => (
                        <option key={grade} value={grade}>
                          {gradeLabels[grade]}
                        </option>
                      ))}
                    </select>
                  ) : enrollment.grade ? (
                    <span className="font-medium">{gradeLabels[enrollment.grade as Grade]}</span>
                  ) : (
                    <span className="text-gray-400 italic">No Grade</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ) && (
                    <button
                      onClick={() => onDelete(enrollment.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
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