import React from 'react'
import './Categories.css'

export default function Categories({ categories, selectedCategoryIndex, setSelectedCategoryIndex }) {
  return (
    <div>
      {categories.map((category, index) => (
        <button
          id="buttonsforcategory"
          key={index}
          onClick={() => setSelectedCategoryIndex(index)}
        >
          {category.name}
        </button>
      ))}
       
    </div>
  );
}
