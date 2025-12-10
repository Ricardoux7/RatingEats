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
    <div className='p-4 border-[#DEE1E6] rounded-lg shadow-md border-2 min-h-screen  w-full mt-15 hidden md:flex flex-col'>
      <form action="" className=" w-full flex flex-col gap-2">
        <h2 className='font-semibold text-2xl'>Filters</h2>
        <p className='text-[#171A1F]'>Cuisine Type</p>
        {categories.map(category => (
          <label key={category} htmlFor={category} className='flex gap-1'>
            <input
              type="checkbox"
              name={category}
              id={category}
              value={category}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedFilters([...selectedFilters, category]);
                } else {
                  setSelectedFilters(selectedFilters.filter(f => f !== category));
                }
              }}
            />
            <p className='ml-2'>{category}</p>
          </label>
        ))}
      </form>
      <p className='font-semibold text-2xl'>Min Rating</p>
      <div className='flex mt-6 gap-2 '>
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type='button'>
            <img
              src={star <= selectedRating ? '../icons/star-green.svg' : '../icons/star-light-green.svg'}
              alt={`${star} stars`}
              className='w-6'
              onClick={() => setSelectedRating(star)}
            />
          </button>
        ))}
      </div>
      <button type='button' onClick={handleApply}>Apply</button>
    </div>
  );
};

export default Filter;