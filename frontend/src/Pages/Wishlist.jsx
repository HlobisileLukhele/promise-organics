import { FaTimesCircle } from "react-icons/fa";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

const Wishlist = () => {
  const wishlistItems = useWishlistStore((state) => state.items);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      image: item.image,
      price: parseFloat(item.price),
      quantity: 1,
    });
  };

  return (
    <div className="overflow-x-auto w-full md:w-11/12 mx-auto p-4">
      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-2">
          <p className="text-xl font-semibold text-[#3d4f3e]">Your wishlist is empty</p>
          <p className="text-gray-500">Browse the shop and add items you love.</p>
        </div>
      ) : (
        <table className="min-w-full text-sm md:text-base mt-24 mb-12">
          <thead>
            <tr className="text-black/20 text-left border-b border-gray-200">
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2 hidden md:table-cell">Price</th>
              <th className="px-4 py-2 hidden md:table-cell">Stock</th>
              <th className="px-4 py-2">Add to cart</th>
              <th className="px-2 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {wishlistItems.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="flex items-center gap-4 px-4 py-4">
                  <img src={item.image} alt={item.name} className="w-[60px] h-[75px] object-contain" />
                  <span className="font-semibold text-black">{item.name}</span>
                </td>

                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="text-black font-medium">R{parseFloat(item.price).toFixed(2)}</span>
                </td>

                <td className="px-4 py-4 hidden md:table-cell text-black">In Stock</td>

                <td className="px-4 py-4">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="border border-gray-200 hover:cursor-pointer px-4 whitespace-nowrap py-2 rounded hover:bg-gray-500 hover:text-white transition text-black"
                  >
                    Add to cart
                  </button>
                </td>

                <td className="px-2 py-4 text-red-500">
                  <button onClick={() => removeFromWishlist(item.id)}>
                    <FaTimesCircle className="text-lg hover:text-red-700 transition" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Wishlist;
