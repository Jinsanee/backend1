import React from 'react';

const Sidebar = () => {
  return (
    <div className="bg-gray-900 text-white w-60 h-full p-4 space-y-4">
      <div className="font-bold text-lg">Menu</div>
      <ul className="space-y-2">
        <li><a href="/" className="block hover:bg-gray-700 p-2 rounded">Home</a></li>
        <li><a href="/subscriptions" className="block hover:bg-gray-700 p-2 rounded">Subscriptions</a></li>
        <li><a href="/library" className="block hover:bg-gray-700 p-2 rounded">Library</a></li>
        <li><a href="/history" className="block hover:bg-gray-700 p-2 rounded">History</a></li>
        <li><a href="/liked" className="block hover:bg-gray-700 p-2 rounded">Liked Videos</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
