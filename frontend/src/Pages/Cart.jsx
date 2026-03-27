import { useState } from "react";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { Link, useNavigate } from "react-router-dom";
import { FREE_SHIPPING_THRESHOLD, calculateShipping } from "@/utils/shipping";

const Cart = () => {
  const { items, updateQuantity, removeItem } = useCartStore();
  const [couponCode, setCouponCode]           = useState("");
  const [showAuthPrompt, setShowAuthPrompt]   = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e, id) => {
    const value = parseInt(e.target.value.replace(/\D/, ""), 10);
    updateQuantity(id, isNaN(value) ? 1 : value);
  };

  const calculateSubtotal = (item) => item.price * item.quantity;
  const totalSubtotal = items.reduce((sum, item) => sum + calculateSubtotal(item), 0);
  const shipping   = calculateShipping(totalSubtotal);
  const grandTotal = totalSubtotal + shipping;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalSubtotal);

  const handleCheckout = () => {
    const token = useUserStore.getState().token;
    if (!token) {
      setShowAuthPrompt(true);
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center py-24 gap-4 w-11/12 mx-auto">
        <h2 className="text-2xl font-semibold text-[#3d4f3e] dark:text-[#f0f7f2]">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-[#7a9e85]">Add some products from the shop to get started.</p>
        <Link to="/shop" className="mt-4 px-6 py-3 bg-[#7c8c7d] text-white font-semibold hover:opacity-90">
          Go to Shop
        </Link>
      </section>
    );
  }

  return (
    <section className="py-8 w-full md:w-11/12 md:mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Cart items — left column */}
        <div className="lg:col-span-2">

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <div className="min-w-[640px]">
              <table className="min-w-full text-sm md:text-base mt-8 mb-6">
                <thead>
                  <tr className="text-black/20 dark:text-[#7a9e85] text-left border-b border-gray-200 dark:border-[#2d5a3d]">
                    <th className="px-4 py-2">Product</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Subtotal</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 dark:border-[#2d5a3d]">
                      <td className="flex items-center gap-4 px-4 py-4">
                        <div className="w-16 h-16 bg-[#f7faf8] dark:bg-[#162d20] rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain p-1"
                            onError={(e) => { e.target.src = '/placeholder.png'; }}
                          />
                        </div>
                        <span className="font-semibold text-black dark:text-[#f0f7f2]">{item.name}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-black dark:text-[#c8dece] font-medium">R{item.price.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-4 text-black dark:text-[#c8dece] font-medium">
                        <div className="flex items-center gap-2 border border-gray-200 dark:border-[#2d5a3d] py-2 px-1">
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
                            className="w-12 text-center outline-none bg-transparent dark:text-[#f0f7f2]"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 cursor-pointer"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-black dark:text-[#c8dece]">
                        R{calculateSubtotal(item).toFixed(2)}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-600 cursor-pointer transition-colors"
                          title="Remove item"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile card layout */}
          <div className="md:hidden space-y-4 mt-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#1e3d2a] rounded-xl border border-gray-100 dark:border-[#2d5a3d] p-4 flex gap-3"
              >
                <div className="w-20 h-20 bg-[#f7faf8] dark:bg-[#162d20] rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img
                    src={item.image || '/placeholder.png'}
                    alt={item.name}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => { e.target.src = '/placeholder.png'; }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1a3d28] dark:text-[#f0f7f2] text-sm leading-tight truncate">
                    {item.name}
                  </p>
                  <p className="text-[#4a7c59] font-semibold text-sm mt-1">
                    R{Number(item.price).toFixed(2)}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-gray-200 dark:border-[#2d5a3d] rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-gray-500 dark:text-[#c8dece] hover:bg-gray-100 dark:hover:bg-[#162d20] transition-colors text-sm"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 text-sm font-medium text-gray-900 dark:text-[#f0f7f2] border-x border-gray-200 dark:border-[#2d5a3d]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-500 dark:text-[#c8dece] hover:bg-gray-100 dark:hover:bg-[#162d20] transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="text-xs text-gray-400 dark:text-[#7a9e85]">Subtotal</p>
                      <p className="font-semibold text-[#1a3d28] dark:text-[#f0f7f2] text-sm">
                        R{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600 transition-colors ml-2"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Coupon row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center mt-8 px-0 pb-6 gap-4">
            <div className="flex flex-col md:flex-row gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="border border-gray-200 dark:border-[#2d5a3d] dark:bg-[#162d20] dark:text-[#f0f7f2] dark:placeholder-[#7a9e85] px-3 py-2.5 rounded w-full font-medium sm:w-64 outline-none focus-within:border-gray-500 dark:focus-within:border-[#4a7c59]"
              />
              <button className="bg-gray-100 dark:bg-[#162d20] border border-gray-200 dark:border-[#2d5a3d] text-black dark:text-[#c8dece] px-4 py-2 hover:bg-[#7c8c7d] cursor-pointer font-medium hover:text-white rounded hover:opacity-90">
                Apply coupon
              </button>
            </div>
          </div>
        </div>

        {/* Order summary — right column */}
        <div className="lg:col-span-1">
          {/* Free shipping banner */}
          {totalSubtotal > 0 && (
            <div className={`rounded-lg px-4 py-3 mb-4 text-sm font-medium border ${
              amountToFreeShipping === 0
                ? 'bg-[#e8f5ec] dark:bg-[#1a3d28] border-[#4a7c59] dark:border-[#4a7c59] text-[#2d5a3d] dark:text-[#a8d4b5]'
                : 'bg-[#f5f0e8] dark:bg-[#2d2a1e] border-[#c4a96a] dark:border-[#8a7040] text-[#5a4a1e] dark:text-[#d4be8a]'
            }`}>
              {amountToFreeShipping === 0
                ? '🎉 You qualify for FREE shipping!'
                : `Add R${amountToFreeShipping.toFixed(2)} more to your order and get FREE shipping!`
              }
            </div>
          )}

          <div className="w-full bg-white dark:bg-[#1e3d2a] rounded-xl border border-gray-100 dark:border-[#2d5a3d] p-6 lg:mt-0">
            <h2 className="text-lg font-medium my-6 dark:text-[#f0f7f2]">Cart totals</h2>

            <div className="border-gray-100 dark:border-[#2d5a3d] border mb-10"></div>

            <div className="flex justify-between text-sm mb-5 border-b border-gray-300 dark:border-[#2d5a3d] py-2.5 dark:text-[#c8dece]">
              <span>Subtotal</span>
              <span>R{totalSubtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-2 text-sm dark:text-[#c8dece]">
              <span>Shipping</span>
              <span>
                {totalSubtotal === 0
                  ? "—"
                  : shipping === 0
                    ? <span className="text-[#4a7c59] dark:text-[#a8d4b5] font-semibold">FREE</span>
                    : `R${shipping.toFixed(2)}`
                }
              </span>
            </div>

            <div className="border-t border-gray-300 dark:border-[#2d5a3d] my-4"></div>

            <div className="flex justify-between text-base dark:text-[#f0f7f2]">
              <span>Total</span>
              <span className="font-bold text-xl">R{grandTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-6 w-full bg-[#7c8c7d] text-white font-semibold py-3 cursor-pointer hover:opacity-90"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1e3d2a] rounded-xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
            <div className="text-4xl mb-4">🌿</div>
            <h2 className="text-xl font-semibold text-[#1a3d28] dark:text-[#f0f7f2] mb-2">Almost there!</h2>
            <p className="text-gray-500 dark:text-[#7a9e85] text-sm mb-6">
              Please log in or create an account to complete your purchase.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-[#4a7c59] text-white py-3 rounded-lg font-medium hover:bg-[#2d5a3d] transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="w-full border border-[#4a7c59] text-[#4a7c59] py-3 rounded-lg font-medium hover:bg-[#f7faf8] dark:hover:bg-[#162d20] transition-colors"
              >
                Create Account
              </button>
              <button
                onClick={() => setShowAuthPrompt(false)}
                className="text-sm text-gray-400 dark:text-[#7a9e85] hover:text-gray-600 dark:hover:text-[#c8dece] mt-1"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Cart;
