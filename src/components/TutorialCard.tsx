import React, { useState } from 'react';
import { X as CloseIcon, ExternalLink } from 'lucide-react'; // X for close

interface TutorialCardProps {
  onDismiss?: () => void; // Optional callback for when card is dismissed
}

const TutorialCard: React.FC<TutorialCardProps> = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!isVisible) {
    return null;
  }

  // Placeholder image URL, replace with actual image from design if available or a suitable generic one
  const imageUrl = "https://images.unsplash.com/photo-1678054491958-54a0c07508c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"; // Example placeholder

  return (
    <div className="w-64 bg-zinc-800/90 border border-zinc-700/70 backdrop-blur-md rounded-xl shadow-xl overflow-hidden text-white transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-2xl">
      <div className="relative">
        <img src={imageUrl} alt="Tutorial Thumbnail" className="w-full h-32 object-cover" />
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 bg-black/40 hover:bg-black/70 rounded-full text-gray-300 hover:text-white transition-colors"
          aria-label="Close tutorial"
        >
          <CloseIcon size={16} />
        </button>
      </div>
      <div className="p-3.5">
        <h4 className="text-sm font-semibold mb-1.5 text-gray-100">
          How to achieve character consistency
        </h4>
        <p className="text-xs text-gray-400/90 mb-3 leading-relaxed">
          Learn tips and tricks to maintain character appearance across multiple image generations.
        </p>
        <a
          href="#" // Replace with actual link
          onClick={(e) => {e.preventDefault(); console.log("Open tutorial link");}}
          className="flex items-center text-xs text-teal-400 hover:text-teal-300 hover:underline group"
        >
          Watch Tutorial
          <ExternalLink size={12} className="ml-1 opacity-70 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>
    </div>
  );
};

export default TutorialCard;
