import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/api.jsx';

const SelectedProduct = () => {
  const { id } = useParams();

  const {
    isLoading,
    error,
    data: selectedProduct,
  } = useQuery({
    queryKey: ['selectedProduct', id],
    queryFn: async () => {
      const res = await api.get(`/api/products/${id}`);
      return res.data.selectedProduct;
    },
    staleTime: 5 * 60 * 1000, 
    retry: false,
  });

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  if (error || !selectedProduct) {
    return <div className="text-center py-10 text-red-500">Product not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-8 rounded-3xl shadow-xl">
        <div className="grid md:grid-cols-2 gap-8">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="w-full h-96 object-cover rounded-xl border-4 border-blue-200 shadow-md"
          />

          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
                {selectedProduct.name}
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                {selectedProduct.description}
              </p>
              <p className="text-3xl font-bold text-blue-700">
                ₹{selectedProduct.price}
              </p>
            </div>

            <Link
              to="/products"
              className="mt-8 inline-block w-max bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow"
            >
              ← Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedProduct;
