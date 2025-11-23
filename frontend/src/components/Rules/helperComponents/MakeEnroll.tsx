'use client'
import { getCourseById } from "@/services/reducers/CourseReducer";
import { createEnrollment } from "@/services/reducers/EnrollmentReducer";
import { clearStudentStatus, getStudentsByName } from "@/services/reducers/UserReducer";
import { useAppDispatch, useAppSelector } from "@/services/store/storeHooks";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { X, Search, User, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface IProps {
    courseId: number;
    onClose: () => void;
    onAddChange: () => void;
}

function MakeEnroll({ courseId, onClose, onAddChange }: IProps) {
    const dispatch = useAppDispatch();
    const [searchValue, setSearchValue] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<{ id: number; name: string } | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    
    const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { currentCourse } = useAppSelector(state => state.courses);
    const { data: students, status: studentsStatus } = useAppSelector(state => state.users.students);
    const { error } = useAppSelector(state => state.enrollments);

    console.log(searchValue);
    console.log(students);

    useEffect(() => {
        clearStudentStatus();
        dispatch(getCourseById(courseId));
    }, [courseId, dispatch]);

    // Debounced search
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (searchValue.trim()) {
            searchTimeoutRef.current = setTimeout(() => {
                dispatch(getStudentsByName(searchValue));
                setIsDropdownOpen(true);
            }, 300);
        } else {
            setIsDropdownOpen(false);
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchValue, dispatch]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        setSelectedStudent(null);
    };

    const handleStudentSelect = useCallback((student: { id: number; name: string }) => {
        setSelectedStudent(student);
        setSearchValue(student.name);
        setIsDropdownOpen(false);
    }, []);

    const clearSelection = () => {
        setSelectedStudent(null);
        setSearchValue('');
    };

    const handleSubmit = async () => {
        if (!selectedStudent) {
            return;
        }

        setSubmitStatus('loading');
        try {
            await dispatch(createEnrollment({
                courseId: courseId,
                studentId: selectedStudent.id,
                semester: 10 // Consider making this dynamic
            })).unwrap();
            
            setSubmitStatus('success');
            setTimeout(() => {
                onClose();
                onAddChange();
            }, 1000);
        } catch (err) {
            setSubmitStatus('error');
            console.error('Enrollment failed:', err);
        }
    };

    const isSubmitDisabled = !selectedStudent || submitStatus === 'loading';

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Enroll Student</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Course Info */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="font-medium text-gray-700 mb-2">Course Information</h3>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">ID:</span> {currentCourse?.id}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Name:</span> {currentCourse?.name}
                    </p>
                </div>

                {/* Student Search */}
                <div className="mb-6" ref={dropdownRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search for Student
                    </label>
                    <div className="relative">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                type="text"
                                value={searchValue}
                                onChange={handleSearchChange}
                                placeholder="Type student name..."
                                onFocus={() => searchValue.trim() && setIsDropdownOpen(true)}
                            />
                            {searchValue && (
                                <button
                                    onClick={clearSelection}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label="Clear search"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        {/* Dropdown */}
                        {isDropdownOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                {studentsStatus === 'loading' ? (
                                    <div className="flex items-center justify-center py-4">
                                        <Loader2 className="animate-spin text-blue-500" size={20} />
                                        <span className="ml-2 text-sm text-gray-600">Searching...</span>
                                    </div>
                                ) : students.length === 0 ? (
                                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                        No students found
                                    </div>
                                ) : (
                                    students.map((student) => (
                                        <button
                                            key={student.id}
                                            onClick={() => handleStudentSelect(student)}
                                            className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors flex items-center"
                                        >
                                            <User className="text-gray-400 mr-3" size={16} />
                                            <div>
                                                <div className="font-medium text-gray-900">{student.name}</div>
                                                <div className="text-xs text-gray-500">ID: {student.id}</div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Messages */}
                {submitStatus === 'error' && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                        <AlertCircle className="text-red-500 mr-2" size={18} />
                        <span className="text-sm text-red-700">
                            {error || 'Failed to enroll student. Please try again.'}
                        </span>
                    </div>
                )}

                {submitStatus === 'success' && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                        <CheckCircle2 className="text-green-500 mr-2" size={18} />
                        <span className="text-sm text-green-700">
                            Student enrolled successfully!
                        </span>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        disabled={submitStatus === 'loading'}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                        {submitStatus === 'loading' ? (
                            <>
                                <Loader2 className="animate-spin mr-2" size={16} />
                                Enrolling...
                            </>
                        ) : (
                            'Enroll Student'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MakeEnroll;