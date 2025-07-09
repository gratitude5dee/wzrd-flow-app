import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Info, ChevronDown, PlusCircle } from 'lucide-react';

// Define common props that all specific nodes might share or that BaseNodeWrapper might use
export interface BaseNodeData {
  label?: string; // Existing basic label
  blockType?: string; // e.g., "IMAGE", "TEXT"
  modelName?: string; // e.g., "FLUX DEV", "GPT-4o Mini"
  learnMoreLink?: string; // URL for "Learn about..."
  // Add other common data fields if needed
}

// Extend NodeProps with our custom data type
export interface CustomNodeProps<T extends BaseNodeData = BaseNodeData> extends NodeProps<T> {}

const BaseNodeWrapper: React.FC<React.PropsWithChildren<CustomNodeProps<any>>> = ({
  data,
  children,
  isConnectable,
  // selected, // React Flow provides this, can be used for conditional styling
}) => {
  const { blockType = "BLOCK", modelName = "Default Model", learnMoreLink = "#" } = data;

  // Placeholder for custom handle style
  // In a real scenario, these would be more complex and might appear on hover/selection
  const handleStyle = {
    width: 12,
    height: 12,
    background: '#34D399', // A distinct color for visibility, can be themed
    border: '1px solid #065F46',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const plusIconInHandle = <PlusCircle size={10} className="text-gray-700 group-hover:text-white transition-colors" />;


  return (
    <div className="bg-zinc-800/70 border border-zinc-700/80 rounded-xl shadow-2xl backdrop-blur-md text-white w-80 hover:border-zinc-600/80 transition-colors duration-150">
      {/* Custom Handles - example placements. Visibility on hover/selection needs more advanced CSS/JS */}
      {/* Top Handle */}
      <Handle type="target" position={Position.Top} style={handleStyle} isConnectable={isConnectable} className="opacity-50 hover:opacity-100 group">{plusIconInHandle}</Handle>
      {/* Left Handle */}
      <Handle type="target" position={Position.Left} style={handleStyle} isConnectable={isConnectable} className="opacity-50 hover:opacity-100 group">{plusIconInHandle}</Handle>

      {/* Node Header */}
      <div className="flex justify-between items-center px-4 py-2.5 border-b border-zinc-700/70">
        <span className="text-xs font-semibold tracking-wider uppercase text-gray-400">{blockType}</span>
        <button className="flex items-center text-xs bg-zinc-700/50 hover:bg-zinc-600/50 px-2.5 py-1 rounded-md transition-colors">
          {modelName}
          <ChevronDown size={14} className="ml-1.5 text-gray-400" />
        </button>
      </div>

      {/* Node Body - Specific content goes here */}
      <div className="p-4 space-y-3">
        {learnMoreLink && (
          <a
            href={learnMoreLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs text-blue-400 hover:text-blue-300 hover:underline mb-1"
          >
            <Info size={13} className="mr-1.5" />
            Learn about {blockType.toLowerCase()} blocks
          </a>
        )}

        {/* Children will render the specific inputs/outputs/content of the node */}
        {children}
      </div>

      {/* Bottom Handle */}
      <Handle type="source" position={Position.Bottom} style={handleStyle} isConnectable={isConnectable} className="opacity-50 hover:opacity-100 group">{plusIconInHandle}</Handle>
      {/* Right Handle */}
      <Handle type="source" position={Position.Right} style={handleStyle} isConnectable={isConnectable} className="opacity-50 hover:opacity-100 group">{plusIconInHandle}</Handle>
    </div>
  );
};

export default memo(BaseNodeWrapper);
