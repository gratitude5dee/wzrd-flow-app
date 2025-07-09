import React, { useState } from 'react';
import { Search, Plus, Image as ImageIcon } from 'lucide-react'; // Using ImageIcon as a placeholder for style card image

interface StylesPanelProps {
  onClose: () => void;
}

const StylesPanel: React.FC<StylesPanelProps> = ({ onClose }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'myStyles'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const placeholderStyles = [
    { id: '1', name: 'Fisheye', imageUrl: '', category: 'Lens Effect' },
    { id: '2', name: 'Motion Blur', imageUrl: '', category: 'Blur' },
    { id: '3', name: 'Cinematic', imageUrl: '', category: 'Look' },
    { id: '4', name: 'Vintage', imageUrl: '', category: 'Color Grade' },
    { id: '5', name: 'Neon Glow', imageUrl: '', category: 'Effect' },
    { id: '6', name: 'Pixelated', imageUrl: '', category: 'Artistic' },
  ];

  const filteredStyles = placeholderStyles.filter(style =>
    style.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activeFilter === 'all' || (activeFilter === 'myStyles' /* && style.isUserStyle */)) // Add isUserStyle check later
  );

  return (
    <div className="flex flex-col h-full text-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Styles</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search Styles..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full bg-zinc-700/50 text-white placeholder-gray-400 pl-10 pr-4 py-2.5 rounded-lg border border-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
        />
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex border border-zinc-700 rounded-md p-0.5">
          <FilterButton name="All" filterKey="all" activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          <FilterButton name="My Styles" filterKey="myStyles" activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        </div>
        <button className="flex items-center text-sm bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-3.5 rounded-md transition-colors">
          <Plus size={18} className="mr-1.5" /> New Style
        </button>
      </div>

      <div className="flex-grow overflow-y-auto py-2 grid grid-cols-2 gap-3 pr-1">
        {filteredStyles.map(style => (
          <StyleCard key={style.id} name={style.name} imageUrl={style.imageUrl} />
        ))}
        {filteredStyles.length === 0 && (
          <p className="col-span-2 text-center text-gray-400 mt-8">No styles found.</p>
        )}
      </div>
    </div>
  );
};

interface FilterButtonProps {
  name: string;
  filterKey: 'all' | 'myStyles';
  activeFilter: string;
  setActiveFilter: (filterKey: 'all' | 'myStyles') => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ name, filterKey, activeFilter, setActiveFilter }) => (
  <button
    onClick={() => setActiveFilter(filterKey)}
    className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors
      ${activeFilter === filterKey
        ? 'bg-zinc-600 text-white'
        : 'text-gray-300 hover:bg-zinc-700/70 hover:text-gray-100'
      }`}
  >
    {name}
  </button>
);

interface StyleCardProps {
  name: string;
  imageUrl: string;
}

const StyleCard: React.FC<StyleCardProps> = ({ name, imageUrl }) => (
  <div className="bg-zinc-700/50 rounded-lg overflow-hidden cursor-pointer group hover:shadow-xl transition-all_">
    <div className="w-full h-20 bg-zinc-600/50 flex items-center justify-center group-hover:opacity-80">
      {imageUrl ? <img src={imageUrl} alt={name} className="w-full h-full object-cover" /> : <ImageIcon size={32} className="text-gray-500" />}
    </div>
    <div className="p-2.5">
      <h4 className="text-xs font-medium text-gray-200 group-hover:text-white truncate">{name}</h4>
    </div>
  </div>
);

export default StylesPanel;
