import api from '../../api/api';
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext';

const DeleteOperator = ({ restaurantId, userId }) => {
  const { user } = useAuth();
  const [operators, setOperators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingOperatorId, setDeletingOperatorId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchOperatos = async () => {
      try {
        const response = await api.get(`restaurants/${restaurantId}/operators`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setOperators(response.data);
      } catch (err) {
        setError('Could not fetch operators. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOperatos();
  }, [restaurantId, userId]);

  const handleDeleteOperator = async (operatorId) => {
    if (!user) {
      setError('You need to be logged in to manage operators.');
      return;
    }
    try {
      await api.delete(`restaurants/${restaurantId}/operators/${operatorId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setOperators(operators.filter((operator) => operator._id !== operatorId));
      setSuccessMessage('Operator deleted successfully.');
    } catch (err) {
      setError('Could not delete operator. Please try again later.');
    } finally {
      setIsLoading(false);
      if (successMessage) {
        for (let i = 0; i < operators.length; i++) {
          if (operators[i]._id === operatorId) {
            setTimeout(() => {
              setSuccessMessage(null);
              navigate('/profile/my-restaurants');
            }, 3000);
          }
        }
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-extrabold mb-4 text-[#2DA800] tracking-tight drop-shadow">Manage Operators</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="w-full ">
          {operators.length === 0 ? (
            <p>No operators found.</p>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[400px] divide-y divide-gray-200 table-auto">
                <thead>
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Last Name</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-2 py-2"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {operators.map((operator) => (
                    <tr key={operator._id}>
                      <td className="px-2 py-2 break-words max-w-[120px]">{operator.name || '-'}</td>
                      <td className="px-2 py-2 font-semibold break-words max-w-[120px] hidden sm:table-cell">{operator.lastName || '-'}</td>
                      <td className="px-2 py-2 break-all max-w-[180px]">{operator.email || '-'}</td>
                      <td className="px-2 py-2">
                        <button
                          onClick={() => handleDeleteOperator(operator._id)}
                          disabled={deletingOperatorId === operator._id}
                          className="bg-red-500 text-white py-2 px-3 rounded hover:bg-red-600 text-center text-xs sm:text-sm"
                        >
                          {deletingOperatorId === operator._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )

};

export default DeleteOperator

