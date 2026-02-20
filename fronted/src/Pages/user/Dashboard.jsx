import { FaBoxOpen } from 'react-icons/fa';
import { useState } from 'react';

export default function Dashboard() {
  const allOrders = [
    {
      id: 'ORD1001',
      date: '2025-08-01',
      total: '$149.99',
      items: 3,
    },
    {
      id: 'ORD1002',
      date: '2025-07-28',
      total: '$89.50',
      items: 2,
    },
    {
      id: 'ORD1003',
      date: '2025-07-25',
      total: '$29.99',
      items: 1,
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = allOrders.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 text-2xl font-medium text-gray-800">
          <FaBoxOpen className="text-[#7c8c7d] size-10" />
          <span>Recent Orders</span>
        </div>

        <input
          type="text"
          placeholder="Search by Order ID"
          className="border border-gray-300 text-sm rounded-sm px-3 py-2 w-full md:w-64 outline-none focus-within:border-[#7c8c7d]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 whitespace-nowrap">
              <th className="p-3">Order ID</th>
              <th className="p-3">Date</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50 border-gray-200 transition whitespace-nowrap">
                <td className="p-3 font-medium text-gray-800">{order.id}</td>
                <td className="p-3 text-gray-700">{order.date}</td>
                <td className="p-3 text-gray-700">
                  {order.items} item{order.items > 1 ? 's' : ''}
                </td>
                <td className="p-3 text-gray-800">{order.total}</td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-6">
                  No orders match that ID.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
