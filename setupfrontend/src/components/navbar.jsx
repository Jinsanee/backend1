import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Brand Name */}
        <div className="text-white text-2xl font-bold">
          <a href="/">YouTube Clone</a>
        </div>

        {/* Search Bar */}
        <div className="flex-1 mx-4">
          <input
            type="text"
            placeholder="Search"
            className="p-2 w-full bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {/* Profile or User Section */}
        <div className="text-white">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
