import React, { useState } from 'react'

export default function MacCardVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-white rounded-lg overflow-hidden relative">
      <video 
        ref={videoRef}
        className="w-full h-full object-cover"
        onEnded={handleVideoEnd}
        onPause={handleVideoPause}
        poster="/images/STEMlearning.jpg"
      >
        <source src="/HomeFiles/section_background.mp4" type='video/mp4' />
        Your browser does not support the video tag.
      </video>
      
      {/* Play button overlay */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-opacity-20 cursor-pointer group"
          onClick={handlePlayClick}
        >
          <div className="w-20 h-20 bg-gray-800 bg-opacity-70 rounded-full flex items-center justify-center group-hover:bg-opacity-80 transition-all duration-200">
            <div className="w-0 h-0 border-l-[16px] border-t-[12px] border-b-[12px] border-l-white border-t-transparent border-b-transparent ml-1"></div>
          </div>
        </div>
      )}
    </div>
  );
}
