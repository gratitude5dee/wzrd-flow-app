import React from 'react';

import AddBlockPanel from './contextual-panels/AddBlockPanel';
import MyFilesPanel from './contextual-panels/MyFilesPanel';
import StylesPanel from './contextual-panels/StylesPanel';

interface ContextualPanelManagerProps {
  activePanel: string | null;
  onClose: () => void; // Function to close the panel
}

const ContextualPanelManager: React.FC<ContextualPanelManagerProps> = ({ activePanel, onClose }) => {
  if (!activePanel) {
    return null;
  }

  let panelContent: React.ReactNode;

  switch (activePanel) {
    case 'addBlock':
      panelContent = <AddBlockPanel onClose={onClose} />;
      break;
    case 'myFiles':
      panelContent = <MyFilesPanel onClose={onClose} />;
      break;
    case 'styles':
      panelContent = <StylesPanel onClose={onClose} />;
      break;
    case 'history':
      panelContent = <div className="p-4">History Panel Content <button onClick={onClose} className="text-xs text-red-400 ml-2">(Close)</button></div>;
      break;
    case 'blocks':
      panelContent = <div className="p-4">Blocks Panel Content <button onClick={onClose} className="text-xs text-red-400 ml-2">(Close)</button></div>;
      break;
    case 'renders':
      panelContent = <div className="p-4">Renders Panel Content <button onClick={onClose} className="text-xs text-red-400 ml-2">(Close)</button></div>;
      break;
    case 'help':
      panelContent = <div className="p-4">Help Panel Content <button onClick={onClose} className="text-xs text-red-400 ml-2">(Close)</button></div>;
      break;
    case 'userWorkspace':
      panelContent = <div className="p-4">User/Workspace Panel Content <button onClick={onClose} className="text-xs text-red-400 ml-2">(Close)</button></div>;
      break;
    default:
      // It's good practice to provide a fallback or log an error for unhandled cases
      console.warn(`Unknown panel selected: ${activePanel}`);
      panelContent = <div className="p-4">Panel not found. <button onClick={onClose} className="text-xs text-red-400 ml-2">(Close)</button></div>;
      // Optionally return null if nothing should be rendered for unknown panels
      // return null;
  }

  return (
    // The padding is removed from here and added to individual panels if needed, for more control.
    // Or, keep padding here if all panels should have it by default. For now, panel components manage their own padding.
    <div className="w-72 h-full bg-zinc-800/95 border-r border-zinc-700/50 overflow-y-auto backdrop-blur-md text-white shadow-2xl">
      {/* Consider adding a transition effect for panel sliding in/out */}
      {panelContent}
    </div>
  );
};

export default ContextualPanelManager;
