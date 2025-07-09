import React from 'react';
import { PlayCircle, UserCircle, Clock } from 'lucide-react'; // Example icons

interface ContentCardProps {
  thumbnailUrl: string;
  category?: string; // e.g., "Tutorial", "Flow"
  duration?: string; // e.g., "5 min", "Quick Tip"
  title: string;
  authorName: string;
  authorAvatarUrl?: string; // Optional
  onClick?: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({
  thumbnailUrl,
  category,
  duration,
  title,
  authorName,
  authorAvatarUrl,
  onClick,
}) => {
  return (
    <div
      className="bg-zinc-800/70 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out group cursor-pointer w-72 flex-shrink-0 transform hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="relative h-40">
        <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        {/* Play icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <PlayCircle size={48} className="text-white/80 drop-shadow-lg" />
        </div>

        {(category || duration) && (
          <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
            {category && <span className="px-2 py-0.5 bg-teal-600/80 text-white text-[10px] font-semibold rounded-full backdrop-blur-sm">{category}</span>}
            {duration && <span className="px-2 py-0.5 bg-black/50 text-gray-200 text-[10px] font-medium rounded-full backdrop-blur-sm flex items-center"><Clock size={10} className="mr-1 opacity-70"/>{duration}</span>}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-100 group-hover:text-teal-400 transition-colors mb-1.5 truncate" title={title}>
          {title}
        </h3>
        <div className="flex items-center text-xs text-gray-400">
          {authorAvatarUrl ? (
            <img src={authorAvatarUrl} alt={authorName} className="w-5 h-5 rounded-full mr-2 object-cover" />
          ) : (
            <UserCircle size={16} className="mr-1.5 opacity-70" />
          )}
          <span>{authorName}</span>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
