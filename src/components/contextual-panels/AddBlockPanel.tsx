import React from 'react';
import { Heading1, Image as ImageIcon, Video as VideoIcon, ArrowRight } from 'lucide-react'; // Using Heading1 for Text
// import { useReactFlow } from 'reactflow'; // Will be needed for addNodes

interface AddBlockPanelProps {
  onClose: () => void;
}

const AddBlockPanel: React.FC<AddBlockPanelProps> = ({ onClose }) => {
  // const { addNodes } = useReactFlow(); // To be used later

  const items = [
    { name: 'Text', icon: <Heading1 size={20} className="mr-3 text-blue-400" />, shortcut: 'T', action: () => console.log('Add Text Block') },
    { name: 'Image', icon: <ImageIcon size={20} className="mr-3 text-purple-400" />, shortcut: 'I', action: () => console.log('Add Image Block') },
    { name: 'Video', icon: <VideoIcon size={20} className="mr-3 text-green-400" />, shortcut: 'V', action: () => console.log('Add Video Block') },
  ];

  // const handleAddNode = (type: string, label: string) => {
  //   const newNode = {
  //     id: `${type}-${Date.now()}`,
  //     type, // This should match a registered node type e.g., 'textToImageNode'
  //     position: { x: Math.random() * 400, y: Math.random() * 400 }, // Example position
  //     data: { label: `${label} Node` },
  //   };
  //   addNodes(newNode);
  //   console.log(`Adding ${type} node`);
  // };


  return (
    <div className="text-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Add Block</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
      </div>

      <ul className="space-y-1 mb-6">
        {items.map((item) => (
          <li key={item.name}>
            <button
              onClick={item.action}
              className="w-full flex items-center p-2.5 rounded-md hover:bg-gray-700/60 transition-colors group"
            >
              {item.icon}
              <span className="flex-grow text-left text-gray-200 group-hover:text-white">{item.name}</span>
              <span className="text-xs text-gray-500 border border-gray-600 px-1.5 py-0.5 rounded-sm group-hover:border-gray-500 group-hover:text-gray-400">
                {item.shortcut}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="text-xs text-gray-400 mb-4 px-2">
        <p className="mb-1"><kbd className="font-sans border border-gray-600 px-1 py-0.5 rounded-sm">↑</kbd> <kbd className="font-sans border border-gray-600 px-1 py-0.5 rounded-sm">↓</kbd> Navigate</p>
        <p><kbd className="font-sans border border-gray-600 px-1.5 py-0.5 rounded-sm">↵</kbd> Select</p>
      </div>

      <a
        href="#"
        onClick={(e) => { e.preventDefault(); console.log('Learn about Blocks'); }}
        className="flex items-center text-blue-400 hover:text-blue-300 hover:underline text-sm group px-2"
      >
        Learn about Blocks
        <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
};

export default AddBlockPanel;
