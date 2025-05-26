import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { FaArrowRight } from 'react-icons/fa'; 
import { api } from '../api/api';

const Products = React.memo(({ data,newProductId}) => {
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(data || []);
 
  
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredProducts(data);     
    }
  }, [data]);

  //call custom  debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() !== '') {
        searchProducts(search);
      } else {
        setFilteredProducts(data); 
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  //call a search product from server
  const searchProducts = async (query) => {
    try {
      const res = await api.get(`/api/products/search?query=${encodeURIComponent(query)}`);
      console.log(res)
      setFilteredProducts(res.data.products);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  //filterProducts empty
  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <div className="text-center text-sm mt-6 text-red-500">No data found</div> 
    );
  }

  //design to show all products
  return (
    <div className="p-4 max-w-5xl mx-auto bg-gray-50">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-indigo-700">List of Products</h1>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border border-indigo-300 rounded-lg mb-8 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts?.map((product) => (
       <div
       key={product._id}
       className={`
         bg-white shadow-md rounded-lg overflow-hidden p-4 border transition duration-300
         ${product._id === newProductId ? 'animate-highlight border-indigo-500 ring-2 ring-indigo-400' : 'border-indigo-200 hover:shadow-lg'}
       `}
     >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-36 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-indigo-600">{product.name}</h2> 
            <p className="text-indigo-500 mb-3 line-clamp-1">{product.description}</p> 
            <p className="font-bold text-indigo-700 mb-5">₹ {product.price}</p>;
            <Link
              to={`/products/${product._id}`}
              className="text-indigo-600 text-sm flex items-center gap-2 hover:underline"
            >
              Read More <FaArrowRight />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
});

export default Products;
