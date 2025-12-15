/**
 * Filter Component
 *
 * Permite filtrar restaurantes por categorías y rating.
 * Gestiona la selección de filtros y aplica los cambios mediante callbacks.
 *
 * Props:
 * @param {Object} filters - Filtros actuales (categorías, rating).
 * @param {Function} setFilters - Setter para actualizar los filtros.
 * @param {Function} onFilterClick - Callback al aplicar los filtros.
 *
 * Estado:
 * - selectedFilters: Categorías seleccionadas.
 * - selectedRating: Rating seleccionado.
 *
 * Características:
 * - Permite seleccionar y aplicar filtros.
 * - Llama a callbacks al aplicar cambios.
 *
 * Ejemplo de uso:
 * <Filter filters={filters} setFilters={setFilters} onFilterClick={cb} />
 *
 * @module Filter
 */
import React, { useState, useEffect } from 'react';

const Filter = ({ filters, setFilters, onFilterClick }) => {
  const [selectedFilters, setSelectedFilters] = useState(filters.categories || []);
  const [selectedRating, setSelectedRating] = useState(filters.rating);

  useEffect(() => {
    setSelectedFilters(filters.categories || []);
    setSelectedRating(filters.rating);
  }, [filters]);

  const categories = ['Italiana', 'China', 'Mexicana', 'Pizzeria', 'Japonesa', 'Thai', 'Vegetariana', 'Vegana', 'Venezolana', 'Comida rapida', 'Hamburguesas', 'Postres', 'Cafeteria', 'Coreana', 'Asiatica', 'Americana', 'Europea'];

  const handleApply = () => {
    setFilters({
      categories: selectedFilters,
      rating: selectedRating,
    });
  };

  return (
    <>
      <div
        className="hp-6 border border-[#2DA800] rounded-xl shadow-sm bg-white min-h-screen w-[85%] mx-auto mt-6 hidden md:flex flex-col sticky top-20 ml-2 p-4"
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
                  src={star <= selectedRating ? '/icons/star-green.svg' : '/icons/star-light-green.svg'}
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
        <button onClick={() => { setSelectedFilters([]); setSelectedRating(null); }} className="mt-4 bg-white text-[#2DA800] rounded-full px-4 py-2 text-sm font-semibold shadow hover:bg-gray-100 transition">Clear Filters</button>
      </div>
      {onFilterClick && (
        <div className="md:hidden border border-[#2DA800] rounded-xl shadow-sm bg-white w-[90%] mx-auto mt-6 mb-6 p-4">
        <form action="">
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
                    src={star <= selectedRating ? '/icons/star-green.svg' : '/icons/star-light-green.svg'}
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
        </form>
                  <button onClick={() => { setSelectedFilters([]); setSelectedRating(null); }} className="mt-4 bg-white text-[#2DA800] rounded-full px-4 py-2 text-sm font-semibold shadow hover:bg-gray-100 transition">Clear Filters</button>
      </div>
      )}
      
    </>
  );
};

export default Filter;