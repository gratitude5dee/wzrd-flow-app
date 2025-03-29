
import { useState } from 'react';
import ConceptTab from './ConceptTab';
import BreakdownTab from './BreakdownTab';
import SettingsCastTab from './SettingsCastTab';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

export interface ProjectData {
  title: string;
  concept: string;
  prompt: string;
  selectedOption: 'improvise' | 'stick_to_script' | null;
  cinematicInspiration?: string;
  aspectRatio?: string;
  videoStyle?: string;
  styleReference?: string;
  characters?: any[];
  // Additional properties needed for ConceptTab
  specialRequests?: string;
  format?: 'custom' | 'short' | 'commercial';
  customFormat?: string;
  genre?: string;
  tone?: string;
  addVoiceover?: boolean;
  product?: string;
  targetAudience?: string;
  mainMessage?: string;
  callToAction?: string;
}

const ProjectSetupWizard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('concept');
  const [projectData, setProjectData] = useState<ProjectData>({
    title: '',
    concept: '',
    prompt: '',
    selectedOption: null,
  });

  const updateProjectData = (data: Partial<ProjectData>) => {
    setProjectData(prevData => ({ ...prevData, ...data }));
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleNext = () => {
    if (activeTab === 'concept') {
      setActiveTab('settings');
    } else if (activeTab === 'settings') {
      setActiveTab('breakdown');
    } else if (activeTab === 'breakdown') {
      // Finish project setup
      navigate('/editor');
    }
  };

  const handleBack = () => {
    if (activeTab === 'settings') {
      setActiveTab('concept');
    } else if (activeTab === 'breakdown') {
      setActiveTab('settings');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D14] text-white">
      <div className="border-b border-[#1D2130]">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="bg-transparent flex w-full border-b-0">
              <TabsTrigger 
                value="concept" 
                className={`flex-1 py-4 px-8 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#3B55E6] data-[state=active]:text-white text-gray-400 hover:text-gray-200 transition-colors ${activeTab === 'concept' ? 'text-white' : ''}`}
              >
                CONCEPT
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className={`flex-1 py-4 px-8 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#3B55E6] data-[state=active]:text-white text-gray-400 hover:text-gray-200 transition-colors ${activeTab === 'settings' ? 'text-white' : ''}`}
              >
                SETTINGS & CAST
              </TabsTrigger>
              <TabsTrigger 
                value="breakdown" 
                className={`flex-1 py-4 px-8 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#3B55E6] data-[state=active]:text-white text-gray-400 hover:text-gray-200 transition-colors ${activeTab === 'breakdown' ? 'text-white' : ''}`}
              >
                BREAKDOWN
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="w-full">
        {activeTab === 'concept' && (
          <ConceptTab 
            projectData={projectData} 
            updateProjectData={updateProjectData} 
          />
        )}
        {activeTab === 'settings' && (
          <SettingsCastTab 
            projectData={projectData} 
            updateProjectData={updateProjectData} 
          />
        )}
        {activeTab === 'breakdown' && (
          <BreakdownTab 
            projectData={projectData} 
            updateProjectData={updateProjectData} 
          />
        )}
      </div>
    </div>
  );
};

export default ProjectSetupWizard;
