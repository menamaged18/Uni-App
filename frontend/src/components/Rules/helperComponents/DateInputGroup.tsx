// DateInputGroup.jsx
import { DateValues } from '@/types';
import { ChangeEvent, useState } from 'react';

interface Iprops {
  onDatesChange: (datesValue: DateValues) => void;
}

const DateInputGroup = ({ onDatesChange }: Iprops) => {
  const [dates, setDates] = useState({
    startDate: '',
    endDate: '',
    regStartDate: '',
    regEndDate: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedDates = {
      ...dates,
      [name]: value
    };
    
    setDates(updatedDates);
    // Pass data back to parent whenever any date changes
    onDatesChange(updatedDates);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <div className="space-y-2">
        <label 
          htmlFor="startDate" 
          className="block text-sm font-medium text-gray-700"
        >
          Course Start Date:
        </label>
        <input 
          type="date" 
          id="startDate" 
          name="startDate"
          value={dates.startDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="space-y-2">
        <label 
          htmlFor="endDate" 
          className="block text-sm font-medium text-gray-700"
        >
          Course End Date:
        </label>
        <input 
          type="date" 
          id="endDate" 
          name="endDate"
          value={dates.endDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="space-y-2">
        <label 
          htmlFor="regStartDate" 
          className="block text-sm font-medium text-gray-700"
        >
          Registration Start Date:
        </label>
        <input 
          type="date" 
          id="regStartDate" 
          name="regStartDate"
          value={dates.regStartDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="space-y-2">
        <label 
          htmlFor="regEndDate" 
          className="block text-sm font-medium text-gray-700"
        >
          Registration End Date:
        </label>
        <input 
          type="date" 
          id="regEndDate" 
          name="regEndDate"
          value={dates.regEndDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default DateInputGroup;