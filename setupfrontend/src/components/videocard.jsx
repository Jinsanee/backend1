import React from 'react';

const VideoCard = ({ title, thumbnail, channel, views }) => {
  return (
    <div className="bg-gray-800 text-white rounded-lg overflow-hidden shadow-lg">
      <img src={thumbnail} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-gray-400">{channel}</p>
        <p className="text-gray-500">{views} views</p>
      </div>
    </div>
  );
};

export default VideoCard;
