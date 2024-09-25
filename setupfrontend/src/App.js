import React from 'react';
import Navbar from './components/navbar.jsx';
import Sidebar from './components/sidebar.jsx';
import VideoGrid from './components/videogrid.jsx';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-4 bg-gray-100">
          <VideoGrid />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center p-4">
        © 2024 YouTube Clone - All Rights Reserved
      </footer>
    </div>
  );
};

export default App;
