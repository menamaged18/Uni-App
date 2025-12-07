import { CourseResponse, DateValues, User } from "@/types";
import { useState } from "react";
import DateInputGroup from "./DateInputGroup";

interface CreateModalProps {
  type: string;
  onClose: () => void;
  onSubmit: (data: any) => void;
  courses?: CourseResponse[];
  lecturers?: User[];
}

export default function CreateModal({ type, onClose, onSubmit, courses = [], lecturers = [] }: CreateModalProps) {
  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    password: '',
    lecturerId: '',
    prerequisiteCoursesIds: []
  });

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!dateValues.startDate) errors.push('Course start date is required');
    if (!dateValues.endDate) errors.push('Course end date is required');
    if (!dateValues.regStartDate) errors.push('Registration start date is required');
    if (!dateValues.regEndDate) errors.push('Registration end date is required');
    
    if (dateValues.startDate && dateValues.endDate && dateValues.startDate > dateValues.endDate) {
      errors.push('Course end date must be after start date');
    }
    
    if (dateValues.regStartDate && dateValues.regEndDate && dateValues.regStartDate > dateValues.regEndDate) {
      errors.push('Registration end date must be after start date');
    }
    
    // if (dateValues.regEndDate && dateValues.startDate && dateValues.regEndDate > dateValues.startDate) {
    //   errors.push('Registration must end before course starts');
    // }
    
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return false;
    }
    
    return true;
  };

  const [dateValues, setDateValues] = useState({
    startDate: "",
    endDate: "",
    regStartDate: "",
    regEndDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    let submitData = { ...formData };
    
    if (type === 'courses') {
      submitData = {
        ...submitData,
        lecturerId: parseInt(submitData.lecturerId) || null,
        prerequisiteCoursesIds: submitData.prerequisiteCoursesIds.map((id: string) => parseInt(id)),
        startDate: dateValues.startDate,
        endDate: dateValues.endDate,
        courseStartRegistirationDate: dateValues.regStartDate,
        courseEndRegistirationDate: dateValues.regEndDate,
        isActive: true
      };
    }
    
    onSubmit(submitData);
  };

  const handleDateChange = (dates: DateValues) => {
    setDateValues(dates);
    // console.log('Date values from child:', dates);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4">
          Create {type.slice(0, -1)}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {(type === 'students' || type === 'lecturers' || type === 'admins') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {type === 'courses' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lecturer
                </label>
                <select
                  value={formData.lecturerId}
                  onChange={(e) => setFormData({ ...formData, lecturerId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Lecturer</option>
                  {lecturers.map((lecturer) => (
                    <option key={lecturer.id} value={lecturer.id}>
                      {lecturer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prerequisites
                </label>
                <select
                  multiple
                  value={formData.prerequisiteCoursesIds}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    prerequisiteCoursesIds: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">Hold Ctrl to select multiple</p>
              </div>

              <DateInputGroup onDatesChange={handleDateChange} />

            </>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}