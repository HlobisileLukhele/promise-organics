import { useState } from 'react';
import { FaEye, FaBox } from 'react-icons/fa';
import { FaShippingFast } from "react-icons/fa";
import { Link } from 'react-router';

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState('');

  const orders = [
    {
      id: 'ORD1001',
      date: '2025-08-01',
      paymentMethod: 'Credit Card',
      shipping: 10,
      customerName: 'John Doe',
      shippingAddress: '123 Main St, Nairobi, Kenya',
      note: 'Please deliver after 5 PM.',
      items: [
        { name: 'Wireless Mouse', qty: 1, price: 25.99 },
        { name: 'Keyboard', qty: 1, price: 45.99 },
        { name: 'USB Cable', qty: 2, price: 5.5 },
      ],
    },
    {
      id: 'ORD1002',
      date: '2025-07-28',
      paymentMethod: 'M-Pesa',
      shipping: 5,
      customerName: 'Jane Wambui',
      shippingAddress: '456 Elm Ave, Nakuru, Kenya',
      note: '',
      items: [
        { name: 'Bluetooth Speaker', qty: 1, price: 59.99 },
        { name: 'Power Bank', qty: 1, price: 29.5 },
      ],
    },
  ];

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 text-2xl font-medium text-gray-800">
          <FaShippingFast className="text-[#7c8c7d] size-10" />
          <span>Your Orders</span>
        </div>
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-gray-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-gray-700">
          <thead className="bg-gray-100 text-left text-gray-600 whitespace-nowrap">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Date</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const subtotal = order.items.reduce((acc, item) => acc + item.price * item.qty, 0);
                const total = subtotal + (order.shipping || 0);

                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition whitespace-nowrap">
                    <td className="p-3 font-medium text-gray-800">{order.id}</td>
                    <td className="p-3 text-gray-700">{order.date}</td>
                    <td className="p-3 text-gray-700">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </td>
                    <td className="p-3 text-gray-800">${total.toFixed(2)}</td>
                    <td className="p-3">
                      <Link
                       to='/account/order-details'
                        className="flex items-center gap-1 text-[#7c8c7d] hover:underline text-sm"
                      >
                        <FaEye />
                        View Details
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
