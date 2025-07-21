import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../UI/ProductCard';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWishlist(res.data);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading your wishlist...</div>;
  }

  return (
    <div className="p-4 sm:p-8 bg-white min-h-screen">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Your Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <ProductCard key={item._id} productCard={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
