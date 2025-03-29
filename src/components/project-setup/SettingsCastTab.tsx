
import { type ProjectData } from './ProjectSetupWizard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Info } from 'lucide-react';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';

interface SettingsCastTabProps {
  projectData: ProjectData;
  updateProjectData: (data: Partial<ProjectData>) => void;
}

const SettingsCastTab = ({ projectData, updateProjectData }: SettingsCastTabProps) => {
  // Cast management
  const [characters, setCharacters] = useState<any[]>([]);

  // Form handling functions
  const handleInputChange = (field: keyof ProjectData, value: string) => {
    updateProjectData({ [field]: value });
  };

  // Aspect ratio selection
  const aspectRatios = [
    { id: "16:9", label: "16:9" },
    { id: "1:1", label: "1:1" },
    { id: "9:16", label: "9:16" }
  ];

  // Video style options
  const videoStyles = [
    { id: "none", label: "None", image: null },
    { id: "cinematic", label: "Cinematic", image: "/lovable-uploads/11f29876-196d-494c-9832-d27087491232.png" },
    { id: "scribble", label: "Scribble", image: "/lovable-uploads/41009c7c-9100-492a-87cf-8e554aab1120.png" },
    { id: "film_noir", label: "Film Noir", image: null }
  ];

  const [selectedAspectRatio, setSelectedAspectRatio] = useState("16:9");
  const [selectedVideoStyle, setSelectedVideoStyle] = useState("cinematic");

  const handleAddCharacter = () => {
    // This would open a dialog to add a character
    console.log("Add character");
  };

  return (
    <div className="min-h-[calc(100vh-180px)] bg-[#0B0D14] text-white">
      <div className="flex">
        {/* Left side - Settings */}
        <div className="w-1/2 p-10 border-r border-[#1D2130]">
          <h2 className="text-2xl font-bold mb-8">Settings</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-sm font-medium text-gray-400">
                PROJECT NAME*
              </Label>
              <Input
                id="projectName"
                value={projectData.title || ""}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="bg-[#0F1526] border-[#2A3558] text-white"
                placeholder="Enter project name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-400">
                ASPECT RATIO
              </Label>
              <div className="flex space-x-2">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setSelectedAspectRatio(ratio.id)}
                    className={`flex items-center justify-center border rounded-md px-4 py-2 ${
                      selectedAspectRatio === ratio.id
                        ? "bg-[#0F1526] border-[#3B55E6] text-white"
                        : "bg-[#0F1526] border-[#2A3558] text-gray-400"
                    }`}
                  >
                    <div className={`flex items-center`}>
                      {ratio.id === "16:9" && (
                        <div className="w-5 h-3 border border-current mr-2"></div>
                      )}
                      {ratio.id === "1:1" && (
                        <div className="w-3 h-3 border border-current mr-2"></div>
                      )}
                      {ratio.id === "9:16" && (
                        <div className="w-3 h-5 border border-current mr-2"></div>
                      )}
                      {ratio.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium text-gray-400">
                  VIDEO STYLE
                </Label>
                <Button
                  variant="link"
                  className="text-[#3B55E6] text-xs p-0 h-auto"
                >
                  View All
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {videoStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedVideoStyle(style.id)}
                    className={`relative aspect-square rounded-md overflow-hidden border ${
                      selectedVideoStyle === style.id
                        ? "border-[#3B55E6]"
                        : "border-[#2A3558]"
                    }`}
                  >
                    {style.image ? (
                      <img
                        src={style.image}
                        alt={style.label}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#0F1526] flex items-center justify-center">
                        {style.id === "none" && (
                          <div className="w-12 h-1 bg-white transform -rotate-45"></div>
                        )}
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1 text-center text-xs">
                      {style.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label className="text-sm font-medium text-gray-400">
                  STYLE REFERENCE
                </Label>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <div className="bg-[#0F1526] border border-[#2A3558] rounded-md p-4 h-24 flex items-center justify-center">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-[#0F1526] border border-[#2A3558] rounded-md">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 15V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">Drag image here</div>
                  <div className="text-xs text-gray-500">Or <span className="text-[#3B55E6]">upload a file</span></div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cinematicInspiration" className="text-sm font-medium text-gray-400">
                CINEMATIC INSPIRATION
              </Label>
              <Input
                id="cinematicInspiration"
                value={projectData.cinematicInspiration || ""}
                onChange={(e) => handleInputChange('cinematicInspiration', e.target.value)}
                className="bg-[#0F1526] border-[#2A3558] text-white"
                placeholder="E.g., Retro, gritty, eclectic, stylish, noir..."
              />
            </div>
          </div>
        </div>

        {/* Right side - Cast */}
        <div className="w-1/2 p-10">
          <h2 className="text-2xl font-bold mb-8">Cast</h2>
          
          <div className="w-full aspect-[1/1.5] bg-[#0F1526] border border-[#2A3558] rounded-lg flex flex-col items-center justify-center mb-6">
            <div className="p-4 rounded-full bg-[#1E212E] mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <button 
              onClick={handleAddCharacter}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Add character
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between p-6 border-t border-[#1D2130]">
        <Button
          variant="outline"
          className="bg-transparent text-white border-[#2A3558] hover:bg-[#2A3558]"
        >
          Back
        </Button>
        <Button
          className="bg-[#3B55E6] hover:bg-[#2E44B8] text-white"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SettingsCastTab;
