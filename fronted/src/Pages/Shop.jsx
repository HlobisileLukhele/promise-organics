import { useState, useMemo } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";
import { FaTags } from "react-icons/fa";
import Products from "@/components/layout/Products";

 const productsData = [
        {
            id: 1,
            name: "Promise Organics Butter",
            category: "Earrings",
            price: "99",
            tags: ["hair-butter", "hair-care", "natural"],
            image: "./assets/butter.png"
        },
        {
            id: 2,
            name: "Promise Organics Hair Oil",
            category: "Bags",
            price: "99",
            tags: ["hair-oil", "hair-care", "natural"],
            image: "./assets/hair-oil.png"
        },
        {
            id: 3,
            name: "Promise Organics Shampoo",
            category: "Earrings",
            price: "99",
            tags: ["hair-shampoo", "hair-care", "natural"],
            image: "./assets/shampoo.png"
        },
        {
            id: 4,
            name: "Promise Organics Conditioner",
            category: "Straw-hats",
            price: "99",
            tags: ["hair-conditioner", "hair-care", "natural"],
            image: "./assets/shampoo.png"
        },
    ];

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const categories = useMemo(() => {
    const map = {};
    productsData.forEach(p => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, []);

  const tags = useMemo(() => {
    const set = new Set();
    productsData.forEach(p => p.tags?.forEach(t => set.add(t)));
    return [...set];
  }, []);

  const handleReset = () => {
    setSearchTerm("");
    setPriceMin("");
    setPriceMax("");
    setSelectedCategory("");
    setSelectedTags([]);
  };

  const filteredProducts = useMemo(() => {
    return productsData.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
      const matchesPrice =
        (!priceMin || parseFloat(p.price) >= parseFloat(priceMin)) &&
        (!priceMax || parseFloat(p.price) <= parseFloat(priceMax));
      const matchesTags =
        selectedTags.length === 0 || selectedTags.every(tag => p.tags?.includes(tag));

      return matchesSearch && matchesCategory && matchesPrice && matchesTags;
    });
  }, [searchTerm, priceMin, priceMax, selectedCategory, selectedTags]);

  return (
    <div className="w-11/12 mx-auto flex flex-col md:items-baseline md:flex-row mt-10 gap-10">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-1/4 border border-gray-200 rounded-xl p-5 space-y-6">
        <div className="flex items-center gap-2 text-base text-gray-700">
          <FiFilter className="text-gray-500" />
          <span>Filter</span>
        </div>

        <div className="relative mb-16">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search product..."
            className="w-full pl-5 pr-4 py-2.5 bg-gray-100 rounded-md outline-none"
          />
          <FiSearch className="absolute size-5 right-3 top-1/2 -translate-y-1/2 text-teal-800" />
        </div>

        <div className="mb-16">
          <h3 className="text-base font-medium mb-2">Price</h3>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={e => setPriceMin(e.target.value)}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-xs outline-none focus-within:border-gray-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={e => setPriceMax(e.target.value)}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-xs outline-none focus-within:border-gray-500"
            />
          </div>
        </div>

        <div>
          <h3 className="text-base font-medium mb-2">Category</h3>
          <ul className="space-y-1 mt-3">
            {Object.entries(categories).map(([cat, count]) => (
              <li key={cat}>
                <button
                  onClick={() => setSelectedCategory(cat === selectedCategory ? "" : cat)}
                  className={`flex justify-between w-full text-sm text-left px-2 py-1 hover:cursor-pointer hover:text-teal-800 rounded-md ${
                    selectedCategory === cat ? "text-teal-800 font-semibold" : ""
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-sm text-gray-500">({count})</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10">
          <h3 className="text-base font-medium mb-5 flex items-center gap-2">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() =>
                  setSelectedTags(prev =>
                    prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                  )
                }
                className={`px-4 py-2 cursor-pointer bg-gray-200 hover:bg-teal-800 hover:text-white capitalize transform duration-200 text-sm ${
                  selectedTags.includes(tag)
                    ? "bg-teal-500 text-white"
                    : "text-gray-600"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-5 py-2 mt-4 bg-teal-800 text-white hover:bg-teal-700 cursor-pointer uppercase text-sm font-medium"
        >
          Reset
        </button>
      </aside>

        <Products title="Shop All" products={filteredProducts} shop={true} />
    </div>
  );
};

export default Shop;
