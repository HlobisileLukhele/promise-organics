import { FaTimesCircle  } from "react-icons/fa";
import ProductOne from '@/assets/product-one.png'

const wishlistItems = [
  {
    id: 1,
    image: ProductOne,
    title: "Basic High-Neck Puff Jacket",
    price: 89.0,
    dateAdded: "July 19, 2025",
    inStock: true,
    button: "Add to cart",
    oldPrice: null,
  },
  {
    id: 2,
    image: ProductOne,
    title: "Basic Colored Sweatpants With Elastic Hems",
    price: 19.9,
    oldPrice: 25.9,
    dateAdded: "July 18, 2025",
    inStock: true,
    button: "Add to cart",
  },
];

const Wishlist = () => {
  return (
    <div className="overflow-x-auto w-full md:w-11/12 mx-auto p-4">
      <table className="min-w-full text-sm md:text-base mt-24 mb-12">
        <thead>
          <tr className="text-black/20 text-left border-b border-gray-200">
            <th className="px-4 py-2">Product</th>
            <th className="px-4 py-2 hidden md:table-cell">Price</th>
            <th className="px-4 py-2 hidden md:table-cell">Date Added</th>
            <th className="px-4 py-2 hidden md:table-cell">Stock</th>
            <th className="px-4 py-2">Add to cart</th>
            <th className="px-2 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {wishlistItems.map((item) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="flex items-center gap-4 px-4 py-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-[60px] h-[75px] object-contain"
                />
                <span className="font-semibold text-black">
                  {item.title}
                </span>
              </td>

              <td className="px-4 py-4 hidden md:table-cell">
                {item.oldPrice && (
                  <span className="line-through text-gray-500 mr-2">
                    ${item.oldPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-black font-medium">
                  ${item.price.toFixed(2)}
                </span>
              </td>

              <td className="px-4 py-4 hidden md:table-cell text-black">
                {item.dateAdded}
              </td>

              <td className="px-4 py-4 hidden md:table-cell text-black">
                {item.inStock ? "In Stock" : "Out of Stock"}
              </td>

              <td className="px-4 py-4">
                <button className="border border-gray-200 hover:cursor-pointer px-4 whitespace-nowrap py-2 rounded hover:bg-gray-500 focus-within:border-gray-500 hover:text-white transition text-black">
                  {item.button}
                </button>
              </td>

              <td className="px-2 py-4 text-red-500">
                <button>
                  <FaTimesCircle  className="text-lg hover:text-red-700 transition" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Wishlist;
