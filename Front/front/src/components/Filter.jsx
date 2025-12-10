import React, { useState, useEffect } from 'react';

const Filter = ({ filters, setFilters }) => {
  const [selectedFilters, setSelectedFilters] = useState(filters.categories || []);
  const [selectedRating, setSelectedRating] = useState(filters.rating);

  useEffect(() => {
    setSelectedFilters(filters.categories || []);
    setSelectedRating(filters.rating);
  }, [filters]);

  const categories = ['Italiana', 'Chinese', 'Mexican', 'Indian', 'Thai', 'Vegetarian', 'Vegan', 'Venezolana', 'Fast Food', 'Seafood'];

  const handleApply = () => {
    setFilters({
      categories: selectedFilters,
      rating: selectedRating,
    });
  };

  return (
    <div
      className="p-6 border border-[#2DA800] rounded-xl shadow-sm bg-white min-h-screen w-[85%] mx-auto mt-6 hidden md:flex flex-col sticky top-20 ml-2"
    >
      <form className="w-full flex flex-col gap-4">
        <h2 className="font-semibold text-xl mb-2 text-[#2DA800]">Filters</h2>
        <div>
          <p className="text-sm text-gray-700 mb-2">Cuisine Type</p>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <label
                key={category}
                htmlFor={category}
                className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 cursor-pointer transition hover:bg-[#eafbe5]"
              >
                <input
                  type="checkbox"
                  name={category}
                  id={category}
                  value={category}
                  checked={selectedFilters.includes(category)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFilters([...selectedFilters, category]);
                    } else {
                      setSelectedFilters(selectedFilters.filter(f => f !== category));
                    }
                  }}
                  className="accent-[#2DA800]"
                />
                <span className="text-sm">{category}</span>
              </label>
            ))}
          </div>
        </div>
      </form>
      <div className="mt-6">
        <p className="font-semibold text-sm mb-2 text-gray-700">Min Rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none"
              onClick={() => setSelectedRating(star)}
            >
              <img
                src={star <= selectedRating ? '../icons/star-green.svg' : '../icons/star-light-green.svg'}
                alt={`${star} stars`}
                className="w-5 h-5"
              />
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={handleApply}
        className="mt-8 bg-[#2DA800] text-white rounded-full px-4 py-2 text-sm font-semibold shadow hover:bg-[#21C45D] transition"
      >
        Apply
      </button>
    </div>
  );
};

export default Filter;