import React from 'react';
import VideoCard from './videocard.jsx';

const VideoGrid = () => {
  // Sample video data
  const videos = [
    { title: 'Video 1', thumbnail: 'https://via.placeholder.com/150', channel: 'Channel 1', views: '1M' },
    { title: 'Video 2', thumbnail: 'https://via.placeholder.com/150', channel: 'Channel 2', views: '500K' },
    { title: 'Video 3', thumbnail: 'https://via.placeholder.com/150', channel: 'Channel 3', views: '750K' },
    // Add more sample videos here
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {videos.map((video, index) => (
        <VideoCard
          key={index}
          title={video.title}
          thumbnail={video.thumbnail}
          channel={video.channel}
          views={video.views}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
