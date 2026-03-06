import InputField from "@/components/common/InputField";
import { useCartStore } from "@/store/cartStore";

const Checkout = () => {
  const cartItems = useCartStore((state) => state.items);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 ? 0 : 99;
  const tax = subtotal * 0.12;
  const total = subtotal + shipping + tax;

  return (
    <section className="h-auto flex flex-col md:flex-row gap-4 w-11/12 mx-auto py-16">
      <form action="#" className="flex flex-col md:flex-row gap-4 w-full">
        <div className="md:w-8/12 w-full">
          <h2 className="text-xl font-medium my-5">Billing details</h2>

          <InputField label="First name" name="fname" type="text" placeholder="John" required />
          <InputField label="Last name" name="lname" type="text" placeholder="Maggie" required />
          <InputField label="Email Address" name="email" type="email" placeholder="you@example.com" required />
          <InputField label="Phone" name="phone" type="text" placeholder="085 283 8553" required />
          <div className="flex flex-col mb-4">
            <label htmlFor="province" className="text-base font-medium mb-1">Province <span className="text-red-500">*</span></label>
            <select
              id="province"
              name="province"
              required
              defaultValue=""
              className="px-4 py-2.5 border border-gray-300 outline-none focus-within:border-gray-500 w-full bg-white text-gray-700"
            >
              <option value="" disabled>Select a province</option>
              <option value="Eastern Cape">Eastern Cape</option>
              <option value="Free State">Free State</option>
              <option value="Gauteng">Gauteng</option>
              <option value="KwaZulu-Natal">KwaZulu-Natal</option>
              <option value="Limpopo">Limpopo</option>
              <option value="Mpumalanga">Mpumalanga</option>
              <option value="Northern Cape">Northern Cape</option>
              <option value="North West">North West</option>
              <option value="Western Cape">Western Cape</option>
            </select>
          </div>
          <InputField label="Street Address" name="address" type="text" placeholder="1597 Sandown Rd" required />
          <InputField label="Town / City" name="town" type="text" placeholder="Durban" required />
          <InputField label="Postcode / ZIP" name="postcode" type="text" placeholder="8191" required />

          <label htmlFor="notes" className="text-base font-medium">Order notes (optional)</label>
          <textarea
            name="notes"
            className="px-4 py-2 border border-gray-300 outline-none focus-within:border-gray-500 w-full mt-2"
            placeholder="Notes about your order, e.g. special notes for delivery."
          ></textarea>
        </div>

        <div className="border border-gray-200 w-full lg:w-4/12 h-fit mt-8 lg:mt-24 p-6 rounded bg-white">
          <h2 className="text-lg font-medium my-6">Your order</h2>

          <div className="mb-6 space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold border-b border-gray-200 pb-2.5">
              <span>Product</span>
              <span>Subtotal</span>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-500 py-2">No items in cart.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start text-sm border-b border-gray-200 py-2.5">
                  <div>
                    <p>{item.name}</p>
                    <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm mt-1">R{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between text-sm mb-5 border-b border-gray-300 py-2.5">
            <span>Subtotal</span>
            <span>R{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-2 text-sm">
            <span>Shipping</span>
            <span>{shipping === 0 ? "—" : `R${shipping.toFixed(2)}`}</span>
          </div>

          <div className="flex justify-between mb-2 text-sm">
            <span>Tax (12%)</span>
            <span>R{tax.toFixed(2)}</span>
          </div>

          <div className="border-t border-gray-300 my-4"></div>

          <div className="flex justify-between text-base">
            <span>Total</span>
            <span className="font-bold text-xl">R{total.toFixed(2)}</span>
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-sm font-medium">Choose Payment Method</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="payment" className="accent-teal-600" defaultChecked />
                Card / Visa
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="payment" className="accent-teal-600" />
                Cash on Delivery
              </label>
            </div>
          </div>

          <p className="text-xs text-gray-600 mt-5 leading-relaxed">
            Your personal data will be used to process your order, support your experience throughout this website. By placing your order, you agree to our{' '}
            <a href="/privacy-policy" className="text-teal-600 underline hover:text-teal-800">Privacy Policy</a>.
          </p>

          <div className="mt-4 flex items-start gap-2">
            <input type="checkbox" className="mt-1 accent-teal-600" required />
            <label className="text-sm text-gray-700">
              I agree to the{' '}
              <a href="/terms" className="text-teal-600 underline hover:text-teal-800">Terms & Conditions</a>
            </label>
          </div>

          <button type="submit" className="mt-6 w-full bg-[#7c8c7d] text-white font-semibold py-3 cursor-pointer hover:opacity-90">
            Place Order
          </button>
        </div>
      </form>
    </section>
  );
};

export default Checkout;
