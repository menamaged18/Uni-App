"use client";
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/services/store/storeHooks';
import {
  getAllStudents,
  getAllLecturers,
  getAllAdmins,
  createStudent,
  createLecturer,
  createAdmin,
  deleteStudent,
  deleteLecturer,
  deleteAdmin
} from '@/services/reducers/UserReducer';
import {
  getAllCourses,
  createCourse,
  createCourseWithPrerequisites,
  deleteCourse
} from '@/services/reducers/CourseReducer';
import { UserCreationReq } from '@/types/index';
import UserManagementTab from './helperComponents/UserManagementTab';
import CourseManagementTab from './helperComponents/CourseManagementTab';
import CreateModal from './helperComponents/CreateModal';

type AdminTab = 'students' | 'lecturers' | 'admins' | 'courses' | 'enrollments';

export default function Admins() {
  const dispatch = useAppDispatch();
  const { currentUser, students, lecturers, admins } = useAppSelector(state => state.users);
  const { courses, loading: coursesLoading } = useAppSelector(state => state.courses);
  
  const [activeTab, setActiveTab] = useState<AdminTab>('students');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const user = currentUser.data;
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isAdmin = user?.role === 'ADMIN' || isSuperAdmin;

  useEffect(() => {
    if (isAdmin) {
      loadInitialData();
    }
  }, [isAdmin]);

  const loadInitialData = () => {
    dispatch(getAllStudents());
    dispatch(getAllLecturers());
    dispatch(getAllCourses());
    
    if (isSuperAdmin) {
      dispatch(getAllAdmins());
    }
  };

  // User Management Functions
  const handleCreateUser = (userData: UserCreationReq, role: 'students' | 'lecturers' | 'admins') => {
    switch (role) {
      case 'students':
        dispatch(createStudent(userData));
        break;
      case 'lecturers':
        dispatch(createLecturer(userData));
        break;
      case 'admins':
        if (isSuperAdmin) {
          dispatch(createAdmin(userData));
        }
        break;
    }
    setShowCreateModal(false);
  };

  const handleDeleteUser = (id: number, role: 'students' | 'lecturers' | 'admins') => {
    if (confirm('Are you sure you want to delete this user?')) {
      switch (role) {
        case 'students':
          dispatch(deleteStudent(id));
          break;
        case 'lecturers':
          dispatch(deleteLecturer(id));
          break;
        case 'admins':
          if (isSuperAdmin) {
            dispatch(deleteAdmin(id));
          }
          break;
      }
    }
  };

  // Course Management Functions
  const handleCreateCourse = (courseData: any) => {
    if (courseData.prerequisites && courseData.prerequisites.length > 0) {
      dispatch(createCourseWithPrerequisites(courseData));
    } else {
      dispatch(createCourse(courseData));
    }
    setShowCreateModal(false);
  };

  const handleDeleteCourse = (courseId: number) => {
    if (confirm('Are you sure you want to delete this course?')) {
      dispatch(deleteCourse(courseId));
    }
  };

  if (!isAdmin) {
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">
          Welcome, {user?.name} ({user?.role})
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('students')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'students'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Students ({students.data.length})
          </button>
          <button
            onClick={() => setActiveTab('lecturers')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'lecturers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Lecturers ({lecturers.data.length})
          </button>
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('admins')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'admins'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Admins ({admins.data.length})
            </button>
          )}
          <button
            onClick={() => setActiveTab('courses')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'courses'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Courses ({courses.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow rounded-lg">
        {/* Students Tab */}
        {activeTab === 'students' && (
          <UserManagementTab
            users={students.data}
            role="students"
            loading={students.status === 'loading'}
            onDelete={handleDeleteUser}
            onCreate={() => setShowCreateModal(true)}
            canCreate={isAdmin}
            canDelete={isAdmin}
          />
        )}

        {/* Lecturers Tab */}
        {activeTab === 'lecturers' && (
          <UserManagementTab
            users={lecturers.data}
            role="lecturers"
            loading={lecturers.status === 'loading'}
            onDelete={handleDeleteUser}
            onCreate={() => setShowCreateModal(true)}
            canCreate={isAdmin}
            canDelete={isSuperAdmin} // Only super admin can delete lecturers
          />
        )}

        {/* Admins Tab - Only for Super Admin */}
        {activeTab === 'admins' && isSuperAdmin && (
          <UserManagementTab
            users={admins.data}
            role="admins"
            loading={admins.status === 'loading'}
            onDelete={handleDeleteUser}
            onCreate={() => setShowCreateModal(true)}
            canCreate={isSuperAdmin}
            canDelete={isSuperAdmin}
          />
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <CourseManagementTab
            courses={courses}
            loading={coursesLoading}
            onDelete={handleDeleteCourse}
            onCreate={() => setShowCreateModal(true)}
            canCreate={isAdmin}
            canDelete={isAdmin}
          />
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateModal
          type={activeTab}
          onClose={() => setShowCreateModal(false)}
          onSubmit={(data) => {
            if (activeTab === 'courses') {
              handleCreateCourse(data);
            } else {
              handleCreateUser(data, activeTab as 'students' | 'lecturers' | 'admins');
            }
          }}
          courses={activeTab === 'courses' ? courses : []}
          lecturers={activeTab === 'courses' ? lecturers.data : []}
        />
      )}
    </div>
  );
}