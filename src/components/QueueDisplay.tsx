import React from 'react';
import { ChevronUp } from 'lucide-react'; // Or ChevronRight if it's for horizontal expansion

interface QueueDisplayProps {
  count?: number; // Make count optional, default to 0
}

const QueueDisplay: React.FC<QueueDisplayProps> = ({ count = 0 }) => {
  return (
    <button className="flex items-center justify-between w-full max-w-xs px-3 py-2 bg-zinc-800/80 hover:bg-zinc-700/80 backdrop-blur-md rounded-lg shadow-lg text-white transition-colors cursor-pointer">
      <div className="flex items-center">
        <span className="text-xs font-medium">Queue</span>
        {count > 0 && (
          <span className="ml-2 text-xs bg-teal-500 text-teal-950 font-semibold px-1.5 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      <ChevronUp size={16} className="text-gray-400" />
    </button>
  );
};

export default QueueDisplay;
