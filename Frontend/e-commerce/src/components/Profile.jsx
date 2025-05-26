import React, { useEffect, useState } from 'react';
import { api } from '../api/api.jsx';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Products from './Products.jsx';
import { receiveMessage,sendMessage } from '../Socket/Socket.jsx';

const Profile = () => {
  const [products, setProducts] = useState({
    name: "",
    description: "",
    price: 0,
    image: ""
  });

  const queryClient = useQueryClient();
  const[newProductId,setNewProductid] = useState(null);
  
  //receiev a message from server via socket.io
  useEffect(() => {
    receiveMessage("product-created", (newProduct) => {
      queryClient.setQueryData(["products"], (old = []) => {
        const exists = old.some((p) => p._id === newProduct._id);
        console.log(exists)
        if (exists) return old;
        return [...old, newProduct];
      });

      
      setNewProductid(newProduct._id);

      // Remove highlight after a few seconds
      setTimeout(() => setNewProductid(null), 10000);
    });
  }, []);

  //handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(products);
    if (products.name.trim() && products.description.trim() && products.price.toString().trim()) {
      addProduct.mutate();
    }
  };

  //add the product in the db
  const addProduct = useMutation({
    mutationFn: async () => {
      const defaultImage = "https://via.placeholder.com/300x200.png?text=No+Image";
      const res = await api.post("/api/products", {
        name: products.name,
        description: products.description,
        price: Number(products.price),
        image: products.image || defaultImage
      });

      if (res.status === 200) {
        return res.data;
      }
    },
    //get the new product from server and send a message via socket.io
    onSuccess: (data) => {
      console.log(data);
      queryClient.setQueryData(["products"], (oldData = []) => [
        ...oldData,
        data.newProduct
      ]);
      setProducts({
        name: "",
        description: "",
        price: 0,
        image: "",
      });
      sendMessage("product-message",data.newProduct)
    },
    onError: (err) => {
      console.log("Mutation error:", err);
    }
  });

  //get all products from server while reloading
  const getAllProducts = async () => {
    try {
      const res = await api.get("/api/products");
      if (res.status === 200) {
        return res.data.allProducts || [];
      }
    } catch (err) {
      console.log(err);
    }
  };

  //get all products using  react query
  const { data: product = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts
  });

  //design the form 
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 bg-indigo-50 rounded-lg shadow-lg h-screen flex flex-col">
    <h1 className="text-4xl font-extrabold mb-3 text-center text-indigo-700">
      Add New Product
    </h1>

    <form
    onSubmit={handleSubmit}
    className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-md"
    style={{ height: '300px' }}  
  >
        <div>
          <label className="block mb-2 font-semibold text-indigo-600">Name</label>
          <input
            type="text"
            value={products.name}
            onChange={(e) =>
              setProducts({ ...products, name: e.target.value })
            }
            className="w-full p-3 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Product Name"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-indigo-600">Description</label>
          <input
            type="text"
            value={products.description}
            onChange={(e) =>
              setProducts({ ...products, description: e.target.value })
            }
            className="w-full p-3 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Product Description"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-indigo-600">Price</label>
          <input
            type="number"
            value={products.price}
            onChange={(e) =>
              setProducts({ ...products, price: e.target.value })
            }
            className="w-full p-3 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Price in USD"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-indigo-600">Image URL</label>
          <input
            type="text"
            value={products.image}
            onChange={(e) =>
              setProducts({ ...products, image: e.target.value })
            }
            className="w-full p-3 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Optional Image URL"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={addProduct.isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-md transition disabled:opacity-70"
          >
            {addProduct.isLoading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>

      <div className="mt-6 flex-grow overflow-y-auto rounded-md border border-indigo-200 p-4 bg-white shadow-inner">
    {isLoading ? (
      <p className="text-center text-indigo-500 font-semibold">Loading products...</p>
    ) : (
      <Products data={product} newProductId ={newProductId} />
    )}
  </div>
    </div>
  );
};

export default Profile;
