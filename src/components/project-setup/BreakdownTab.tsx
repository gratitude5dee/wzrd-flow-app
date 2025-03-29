
import { type ProjectData } from './ProjectSetupWizard';
import { Button } from '@/components/ui/button';
import { Plus, X, Info } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { SceneEditDialog, type Scene } from './SceneEditDialog';

interface BreakdownTabProps {
  projectData: ProjectData;
  updateProjectData: (data: Partial<ProjectData>) => void;
}

const BreakdownTab = ({ projectData, updateProjectData }: BreakdownTabProps) => {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [showInfoAlert, setShowInfoAlert] = useState(true);

  const handleNewScene = () => {
    const newScene: Scene = {
      id: scenes.length + 1,
      title: `Scene ${scenes.length + 1} - New Scene`,
      description: "",
      sceneDescription: "",
      voiceover: "",
      location: "",
      lighting: "",
      weather: ""
    };
    setEditingScene(newScene);
  };

  const handleSaveScene = (updatedScene: Scene) => {
    setScenes(prevScenes => {
      const sceneExists = prevScenes.some(s => s.id === updatedScene.id);
      if (sceneExists) {
        return prevScenes.map(s => s.id === updatedScene.id ? updatedScene : s);
      } else {
        return [...prevScenes, updatedScene];
      }
    });
    setEditingScene(null);
  };

  const handleCloseAlert = () => {
    setShowInfoAlert(false);
  };

  return (
    <div className="min-h-[calc(100vh-180px)] bg-[#0B0D14] text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-10">Breakdown</h1>
      
      {showInfoAlert && scenes.length === 0 && (
        <Alert className="mb-8 bg-[#0F1526] border-[#2A3558] text-white">
          <Info className="h-5 w-5 text-blue-400" />
          <AlertDescription className="flex items-center justify-between">
            <span>No scenes yet. Please provide more visual details in your prompt so we can better visualize it.</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto p-1 text-gray-400 hover:text-white hover:bg-transparent"
              onClick={handleCloseAlert}
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="h-[400px] bg-[#1A1C26] rounded-lg flex flex-col items-center justify-center mb-8">
        {scenes.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <div className="p-4 rounded-full bg-[#1E212E] mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <button 
              onClick={handleNewScene}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Add a scene
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 w-full">
            {/* Scene cards would go here */}
          </div>
        )}
      </div>
      
      {editingScene && (
        <SceneEditDialog
          scene={editingScene}
          open={!!editingScene}
          onClose={() => setEditingScene(null)}
          onSave={handleSaveScene}
        />
      )}

      <div className="flex justify-between mt-auto">
        <Button
          variant="outline"
          className="bg-transparent text-white border-[#2A3558] hover:bg-[#2A3558]"
        >
          Back
        </Button>
        <Button
          className="bg-[#3B55E6] hover:bg-[#2E44B8] text-white"
        >
          Start
        </Button>
      </div>
    </div>
  );
};

export default BreakdownTab;
