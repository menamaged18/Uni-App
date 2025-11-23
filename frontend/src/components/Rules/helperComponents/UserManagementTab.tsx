import { User } from "@/types";

interface UserManagementTabProps {
  users: User[];
  role: 'students' | 'lecturers' | 'admins';
  loading: boolean;
  onDelete: (id: number, role: 'students' | 'lecturers' | 'admins') => void;
  onCreate: () => void;
  canCreate: boolean;
  canDelete: boolean;
}

export default function UserManagementTab({ users, role, loading, onDelete, onCreate, canCreate, canDelete }: UserManagementTabProps) {
  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold capitalize">{role}</h2>
        {canCreate && (
          <button
            onClick={onCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer"
          >
            Create {role.slice(0, -1)}
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
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {canDelete && (
                    <button
                      onClick={() => onDelete(user.id, role)}
                      className="text-red-600 hover:text-red-900 ml-4 cursor-pointer"
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