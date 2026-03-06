import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function OrderDetails() {

  const order = {
    id: 'ORD1001',
    date: '02 August 2025',
    items: [
      { name: 'Basic High-Neck Puff Jacket', qty: 1, price: 89.0 },
      { name: 'Slim Fit Jeans', qty: 2, price: 44.75 },
      { name: 'Canvas Sneakers', qty: 1, price: 65.5 },
    ],
    shipping: 15.0,
    paymentMethod: 'Credit Card',
    note: 'Leave at the front door if not home.',
    status: 'On hold',
  };

  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = order.shipping || 0;
  const total = subtotal + shipping;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link
        to="/account/orders"
        className="mb-6 text-[#7c8c7d]  hover:underline flex items-center">
        <FaArrowLeft className="mr-2" /> Back to Orders
      </Link>

      <div className="mb-4">
        <h1 className="text-2xl font-medium text-gray-800 mb-2">Order #{order.id}</h1>
        <p className="text-sm text-gray-500">Placed on {order.date}</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Items</h2>
        <div className="space-y-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-700">{item.name} × {item.qty}</span>
              <span className="text-gray-800 font-medium">${(item.qty * item.price).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4 space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment method:</span>
            <span>{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-3">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          {order.note && (
            <div className="pt-3">
              <span className="font-medium text-gray-700">Note: </span>
              <span className="text-gray-600">{order.note}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
