
import Header from '../components/Header';
import Canvas from '../components/Canvas';
import { ReactFlowProvider } from 'reactflow';
import { useState } from 'react';
import 'reactflow/dist/style.css';
import StoryboardPage from './Storyboard';
import ShotEditor from './ShotEditor';
import CreditsDisplay from '../components/CreditsDisplay';

// New Sidebar Components
import IconSidebar from '../components/IconSidebar';
import ContextualPanelManager from '../components/ContextualPanelManager';

// Bottom UI Elements
import QueueDisplay from '../components/QueueDisplay';
import TutorialCard from '../components/TutorialCard';

interface IndexProps {
  viewMode?: 'studio' | 'storyboard' | 'editor';
}

const Index = ({ viewMode: initialViewMode }: IndexProps) => {
  const [viewMode, setViewMode] = useState<'studio' | 'storyboard' | 'editor'>(initialViewMode || 'studio');
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const handleSetActivePanel = (panelName: string) => {
    // If the clicked panel is already active, close it. Otherwise, open the new one.
    setActivePanel(prevPanel => prevPanel === panelName ? null : panelName);
  };

  const closePanel = () => {
    setActivePanel(null);
  };

  return (
    <ReactFlowProvider>
      <div className="w-screen h-screen bg-[#0F1117] text-white flex flex-col overflow-hidden">
        <Header viewMode={viewMode} setViewMode={setViewMode} />
        
        {viewMode === 'studio' && (
          <div className="flex flex-1 h-[calc(100vh-4rem)]"> {/* Assuming header height is 4rem */}
            <IconSidebar setActivePanel={handleSetActivePanel} activePanel={activePanel} />
            {activePanel && <ContextualPanelManager activePanel={activePanel} onClose={closePanel} />}
            <main className={`flex-1 relative canvas-background ${activePanel ? 'ml-0' : 'ml-0'}`}> {/* Adjust margin if panel pushes canvas */}
              <Canvas />
              {/* Bottom Left Credits Display */}
              <div className="absolute bottom-4 left-4 z-10"> {/* Ensure CreditsDisplay is above canvas elements if needed */}
                <CreditsDisplay showTooltip={false} />
              </div>

              {/* Bottom Right Queue and Tutorial */}
              <div className="absolute bottom-4 right-4 flex flex-col items-end space-y-3 z-10 w-64"> {/* Added w-64 for defined width */}
                <QueueDisplay count={3} /> {/* Example count */}
                <TutorialCard />
              </div>
            </main>
          </div>
        )}
        
        {viewMode === 'storyboard' && (
          <StoryboardPage viewMode={viewMode} setViewMode={setViewMode} />
        )}
        
        {viewMode === 'editor' && (
          <ShotEditor viewMode={viewMode} setViewMode={setViewMode} />
        )}
        
      </div>
    </ReactFlowProvider>
  );
};

export default Index;
