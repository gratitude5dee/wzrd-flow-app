import React, { useState } from 'react';
import { Search, Plus, UploadCloud } from 'lucide-react';

interface MyFilesPanelProps {
  onClose: () => void;
}

const MyFilesPanel: React.FC<MyFilesPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'myFiles' | 'savedBlocks' | 'unsplash'>('myFiles');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const isSearching = searchTerm.length > 0;

  return (
    <div className="flex flex-col h-full text-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">My Files</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search Assets..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full bg-zinc-700/50 text-white placeholder-gray-400 pl-10 pr-4 py-2.5 rounded-lg border border-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
        />
      </div>

      {!isSearching && (
        <div className="flex border-b border-zinc-700 mb-1">
          <TabButton name="My Files" tabKey="myFiles" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton name="Saved Blocks" tabKey="savedBlocks" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton name="Unsplash" tabKey="unsplash" activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      )}

      <div className="flex-grow overflow-y-auto py-2">
        {isSearching ? (
          <div className="text-center text-gray-400 py-10">
            <p>Searching for "{searchTerm}"...</p>
            {/* Search results would go here */}
          </div>
        ) : (
          <>
            {activeTab === 'myFiles' && <div className="p-2 text-gray-300">Content for My Files. <UploadButton /> </div>}
            {activeTab === 'savedBlocks' && <div className="p-2 text-gray-300">Content for Saved Blocks.</div>}
            {activeTab === 'unsplash' && <div className="p-2 text-gray-300">Content for Unsplash. Search Unsplash above.</div>}
          </>
        )}
         {!isSearching && activeTab !== 'myFiles' && <div className="mt-4"><UploadButton /></div>}
      </div>
    </div>
  );
};

interface TabButtonProps {
  name: string;
  tabKey: 'myFiles' | 'savedBlocks' | 'unsplash';
  activeTab: string;
  setActiveTab: (tabKey: 'myFiles' | 'savedBlocks' | 'unsplash') => void;
}

const TabButton: React.FC<TabButtonProps> = ({ name, tabKey, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(tabKey)}
    className={`px-4 py-2 text-xs font-medium transition-colors
      ${activeTab === tabKey
        ? 'border-b-2 border-blue-500 text-white'
        : 'text-gray-400 hover:text-gray-200 border-b-2 border-transparent'
      }`}
  >
    {name}
  </button>
);

const UploadButton: React.FC = () => (
  <button className="mt-4 w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-600 hover:border-zinc-500 rounded-lg text-gray-400 hover:text-gray-300 transition-colors">
    <UploadCloud size={32} className="mb-2" />
    <span className="text-sm font-medium">Upload Files</span>
    <span className="text-xs mt-1">Drag & drop or click to browse</span>
    {/* <Plus size={20} className="mr-2" /> Upload */}
  </button>
);

export default MyFilesPanel;
