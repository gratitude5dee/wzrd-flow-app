import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Users, Star, Folder, Settings, LogOut, PlusCircle, Search, Bell, HelpCircle, Home } from 'lucide-react';

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href?: string;
  subItems?: NavItem[];
  onClick?: () => void;
}

const CommunitySidebar: React.FC = () => {
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<boolean>(true); // Default to expanded
  const [activeItem, setActiveItem] = useState<string>('Community'); // Default active item

  const handleToggleWorkspaces = () => {
    setExpandedWorkspaces(!expandedWorkspaces);
  };

  const handleItemClick = (itemName: string, action?: () => void) => {
    setActiveItem(itemName);
    action?.();
  };

  const topNavItems: NavItem[] = [
    { name: 'Home', icon: <Home size={18} />, href: '/home' }, // Assuming a general home or back to projects
    { name: 'Shared with me', icon: <Users size={18} />, href: '#' },
    { name: 'Community', icon: <Users size={18} />, href: '/community' }, // Link to the community page itself
    { name: 'Favorites', icon: <Star size={18} />, href: '#' },
  ];

  const workspaceNavItems: NavItem[] = [
    { name: 'All', icon: <Folder size={18} />, href: '#' },
    { name: 'Private', icon: <Folder size={18} />, href: '#' },
    // Add more workspace specific items or folders here
  ];

  // Placeholder for workspace/user name
  const currentWorkspace = "S-Dee Studio";
  const userName = "S-Dee";


  return (
    <div className="w-64 h-screen bg-zinc-900 border-r border-zinc-800/70 text-gray-300 flex flex-col p-4 space-y-2 overflow-y-auto">
      {/* Workspace Switcher */}
      <div className="mb-3">
        <button className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-800/70 transition-colors">
          <div className="flex items-center">
            <div className="w-7 h-7 bg-purple-600 rounded-md flex items-center justify-center text-sm font-semibold text-white mr-2.5">
              {currentWorkspace.substring(0, 1)}
            </div>
            <span className="text-sm font-semibold text-gray-100">{currentWorkspace}</span>
          </div>
          <ChevronDown size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Top Navigation */}
      <nav className="space-y-1">
        {topNavItems.map((item) => (
          <a
            key={item.name}
            href={item.href || '#'}
            onClick={() => handleItemClick(item.name, item.onClick)}
            className={`flex items-center py-2 px-2.5 rounded-md text-sm transition-colors group
              ${activeItem === item.name ? 'bg-zinc-700/70 text-white font-medium' : 'hover:bg-zinc-800/60 hover:text-gray-100'}`}
          >
            {React.cloneElement(item.icon as React.ReactElement, { className: `mr-3 ${activeItem === item.name ? 'text-teal-400' : 'text-gray-400 group-hover:text-gray-300'}` })}
            {item.name}
          </a>
        ))}
      </nav>

      {/* Workspace Section */}
      <div className="pt-3 mt-2 border-t border-zinc-800/60">
        <button
          onClick={handleToggleWorkspaces}
          className="w-full flex items-center justify-between py-2 px-2.5 rounded-md hover:bg-zinc-800/60 transition-colors group"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 group-hover:text-gray-400">Workspace</span>
          {expandedWorkspaces ? <ChevronDown size={16} className="text-gray-500" /> : <ChevronRight size={16} className="text-gray-500" />}
        </button>
        {expandedWorkspaces && (
          <nav className="space-y-0.5 mt-1.5 ml-1">
            {workspaceNavItems.map((item) => (
              <a
                key={item.name}
                href={item.href || '#'}
                onClick={() => handleItemClick(item.name, item.onClick)}
                className={`flex items-center py-1.5 px-2.5 rounded-md text-sm transition-colors group
                  ${activeItem === item.name ? 'bg-zinc-700/50 text-white' : 'hover:bg-zinc-800/50 hover:text-gray-200'}`}
              >
                 {React.cloneElement(item.icon as React.ReactElement, { className: `mr-2.5 w-4 h-4 ${activeItem === item.name ? 'text-teal-400' : 'text-gray-500 group-hover:text-gray-400'}` })}
                {item.name}
              </a>
            ))}
             <button className="flex items-center py-1.5 px-2.5 rounded-md text-sm text-gray-500 hover:text-teal-400 hover:bg-zinc-800/50 transition-colors w-full group">
                <PlusCircle size={15} className="mr-2.5 text-gray-500 group-hover:text-teal-400" /> New Folder
            </button>
          </nav>
        )}
      </div>

      {/* User Profile / Settings Footer */}
      <div className="mt-auto border-t border-zinc-800/60 pt-3 space-y-1">
         <a href="#" className="flex items-center py-2 px-2.5 rounded-md text-sm hover:bg-zinc-800/60 hover:text-gray-100 group">
            <Bell size={18} className="mr-3 text-gray-400 group-hover:text-gray-300" /> Notifications
        </a>
        <a href="#" className="flex items-center py-2 px-2.5 rounded-md text-sm hover:bg-zinc-800/60 hover:text-gray-100 group">
            <HelpCircle size={18} className="mr-3 text-gray-400 group-hover:text-gray-300" /> Help & Support
        </a>
        <button className="w-full flex items-center py-2 px-2.5 rounded-md text-sm hover:bg-zinc-800/60 hover:text-gray-100 group">
            <Settings size={18} className="mr-3 text-gray-400 group-hover:text-gray-300" /> Settings
        </button>
        <div className="border-t border-zinc-800/60 my-1"></div>
        <button className="w-full flex items-center py-2 px-2.5 rounded-md hover:bg-zinc-800/60 transition-colors group">
            <div className="w-7 h-7 bg-pink-600 rounded-full flex items-center justify-center text-xs font-semibold text-white mr-2.5">
                {userName.substring(0,1)}
            </div>
            <span className="text-sm text-gray-200 group-hover:text-white">{userName}</span>
            <LogOut size={16} className="ml-auto text-gray-500 group-hover:text-red-400" />
        </button>
      </div>
    </div>
  );
};

export default CommunitySidebar;
