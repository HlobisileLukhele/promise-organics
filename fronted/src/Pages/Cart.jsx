import { useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import ProductOne from "@/assets/product-one.png";

const Cart = () => {
  const initialCartItems = [
    {
      id: 1,
      image: ProductOne,
      title: "Basic High-Neck Puff Jacket",
      price: 89.0,
      dateAdded: "July 19, 2025",
      inStock: true,
      oldPrice: null,
      quantity: 1,
    },
    {
      id: 2,
      image: ProductOne,
      title: "Basic Colored Sweatpants With Elastic Hems",
      price: 19.9,
      oldPrice: 25.9,
      dateAdded: "July 18, 2025",
      inStock: true,
      quantity: 1,
    },
  ];

  const [cartItems, setCartItems] = useState(initialCartItems);
  const [couponCode, setCouponCode] = useState("");

  const updateQuantity = (id, value) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: value < 1 ? 1 : value,
            }
          : item
      )
    );
  };

  const handleInputChange = (e, id) => {
    const value = parseInt(e.target.value.replace(/\D/, ""), 10);
    updateQuantity(id, isNaN(value) ? 1 : value);
  };

  const calculateSubtotal = (item) => item.price * item.quantity;
  const totalSubtotal = cartItems.reduce((sum, item) => sum + calculateSubtotal(item), 0);
  const shipping = totalSubtotal > 100 ? 0 : 9.99;
  const tax = totalSubtotal * 0.12;
  const grandTotal = totalSubtotal + shipping + tax;

  return (
    <section className="flex flex-col lg:flex-row gap-4 py-8 w-full md:w-11/12 md:mx-auto md:items-baseline">
      <div className="w-full lg:w-8/12 h-full">
        <div className="overflow-x-auto">
          <div className="min-w-[768px]">
            <table className="min-w-full text-sm md:text-base mt-8 mb-6">
              <thead>
                <tr className="text-black/20 text-left border-b border-gray-200">
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="flex items-center gap-4 px-4 py-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-[60px] h-[75px] object-contain"
                      />
                      <span className="font-semibold text-black">{item.title}</span>
                    </td>

                    <td className="px-4 py-4">
                      {item.oldPrice && (
                        <span className="line-through text-gray-500 mr-2">
                          ${item.oldPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-black font-medium">${item.price.toFixed(2)}</span>
                    </td>

                    <td className="px-4 py-4 text-black font-medium">
                      <div className="flex items-center gap-2 border border-gray-200 py-2 px-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 cursor-pointer"
                        >
                          <FiMinus size={14} />
                        </button>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={item.quantity}
                          onChange={(e) => handleInputChange(e, item.id)}
                          className="w-12 text-center outline-none"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 cursor-pointer"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-black">
                      ${calculateSubtotal(item).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center mt-10 justify-between px-4 pb-6 gap-4">
          <div className="flex flex-col md:flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="border border-gray-200 px-3 py-2.5 rounded w-full font-medium sm:w-64 outline-none focus-within:border-gray-500"
            />
            <button className="bg-gray-100 border border-gray-200 text-black px-4 py-2 hover:bg-[#7c8c7d] cursor-pointer font-medium hover:text-white rounded hover:opacity-90">
              Apply coupon
            </button>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 w-full lg:w-4/12 h-fit mt-8 lg:mt-24 p-6 rounded bg-white">
        <h2 className="text-lg font-medium my-6">Cart totals</h2>

        <div className="border-gray-100 border mb-10"></div>

        <div className="flex justify-between text-sm mb-5 border-b border-gray-300 py-2.5">
          <span>Subtotal</span>
          <span>${totalSubtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between mb-2 text-sm">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>

        <div className="flex justify-between mb-2 text-sm">
          <span>Tax (12%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        <div className="border-t border-gray-300 my-4"></div>

        <div className="flex justify-between text-base">
          <span>Total</span>
          <span className="font-bold text-xl">${grandTotal.toFixed(2)}</span>
        </div>

        <button className="mt-6 w-full bg-[#7c8c7d] text-white font-semibold py-3 cursor-pointer hover:opacity-90">
          Proceed to Checkout
        </button>
      </div>
    </section>
  );
};

export default Cart;
