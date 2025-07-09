import React from 'react';
import { Plus, LayoutGrid, History, Layers, Sparkles, Play, HelpCircle, UserCircle2 } from 'lucide-react'; // Assuming UserCircle2 for avatar

interface IconSidebarProps {
  // Will be: setActivePanel: (panelName: string | null) => void;
  setActivePanel: (panelName: string) => void; // Simplified for now
  activePanel: string | null;
}

const iconButtonClass = "p-2.5 rounded-lg hover:bg-gray-700/70 transition-colors cursor-pointer";
const activeIconButtonClass = "bg-gray-600/80 text-white";

const IconSidebar: React.FC<IconSidebarProps> = ({ setActivePanel, activePanel }) => {
  const icons = [
    { name: 'addBlock', icon: <Plus size={24} />, title: 'Add Block' },
    { name: 'myFiles', icon: <LayoutGrid size={24} />, title: 'My Files/Assets' },
    { name: 'history', icon: <History size={24} />, title: 'History' },
    { name: 'blocks', icon: <Layers size={24} />, title: 'Blocks' }, // Or another icon for "Blocks"
    { name: 'styles', icon: <Sparkles size={24} />, title: 'Styles' },
    { name: 'renders', icon: <Play size={24} />, title: 'Renders/Exports' },
    { name: 'help', icon: <HelpCircle size={24} />, title: 'Help' },
  ];

  const handleIconClick = (panelName: string) => {
    if (activePanel === panelName) {
      setActivePanel(''); // Deselect if clicking the same icon
    } else {
      setActivePanel(panelName);
    }
  };

  return (
    <div className="w-16 h-full bg-zinc-900/70 border-r border-zinc-800/50 flex flex-col items-center py-4 space-y-3 backdrop-blur-md">
      {icons.map((item) => (
        <button
          key={item.name}
          title={item.title}
          onClick={() => handleIconClick(item.name)}
          className={`${iconButtonClass} ${activePanel === item.name ? activeIconButtonClass : 'text-gray-400 hover:text-gray-200'}`}
        >
          {item.icon}
        </button>
      ))}
      <div className="mt-auto mb-2"> {/* Pushes avatar to the bottom */}
        <button
          title="S-Dee Studio"
          onClick={() => handleIconClick('userWorkspace')} // Example panel name
          className={`${iconButtonClass} ${activePanel === 'userWorkspace' ? activeIconButtonClass : 'text-gray-400 hover:text-gray-200'}`}
        >
          <UserCircle2 size={28} />
        </button>
      </div>
    </div>
  );
};

export default IconSidebar;
