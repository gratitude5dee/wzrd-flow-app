
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { type ProjectData } from './ProjectSetupWizard';

interface StorylineTabProps {
  projectData: ProjectData;
  updateProjectData: (data: Partial<ProjectData>) => void;
}

interface AlternativeStoryline {
  title: string;
  description: string;
  tags: string[];
  fullStory: string;
}

const StorylineTab = ({ projectData, updateProjectData }: StorylineTabProps) => {
  const [characterCount, setCharacterCount] = useState(0);
  const [selectedStoryline, setSelectedStoryline] = useState<AlternativeStoryline | null>(null);

  const alternativeStorylines: AlternativeStoryline[] = [
    {
      title: "Veil of Mist",
      description: "A group of adventurers must confront their fears to escape a captivating utopia shrouded in fog.",
      tags: ["Adventure", "Fantasy", "Self-Discovery"],
      fullStory: `In 'Veil of Mist', a group of five adventurers—Lara, a determined leader; Sam, a skeptical scientist; Jamie, an optimistic dreamer; Alex, a rugged survivalist; and Mia, an empathetic healer—set sail for uncharted waters. After a fierce storm, they find themselves on an enchanting island enveloped in a mystical fog. As they explore, they discover a vibrant civilization that lives in harmony, untouched by the troubles of the outside world. The inhabitants, led by the wise Elder Thalia, offer them a chance to embrace this paradise forever.

As they experience the island's wonders, each adventurer grapples with their inner conflicts and desires. Lara, haunted by her past failures, sees this as a chance for redemption. Sam, who doubts the island's reality, conducts experiments that challenge their perceptions. Jamie revels in the freedom and joy, while Alex is torn between adventure and comfort. Mia connects deeply with the island's people, feeling a sense of belonging she has never known.

However, the allure of the utopia comes with a price. As the fog thickens, revealing darker elements of the island's magic, the adventurers must confront their fears and decide whether to stay in this paradise or return to their flawed reality. The film culminates in a heart-wrenching choice as they gather on a cliff overlooking the ocean, with Thalia's voice echoing a warning about the dangers of forgetting one's true self. This moment of reflection, enhanced by evocative voiceover, leads them to a collective decision that defines their futures.`
    },
    {
      title: "Veil of Mist",
      description: "Five adventurers face their desires in a utopia, but the fog hides secrets that threaten their escape.",
      tags: ["Fantasy", "Mystery", "Character Drama"],
      fullStory: `In 'Veil of Mist', a crew of five adventurers—Lara, Sam, Jamie, Alex, and Mia—sets off on a journey that leads them to a mysterious island shrouded in an ethereal fog. Upon landing, they are welcomed by a utopian society where every wish seems to be granted. The island's beauty is mesmerizing, with lush landscapes and joyful inhabitants who embody the essence of peace and happiness. The adventurers are initially enchanted, enjoying lavish feasts and serene days filled with laughter.

However, as the days pass, the fog begins to unveil aspects of the island that are eerily unsettling. Lara discovers that the island's paradise is maintained through the sacrifices of past visitors, who vanished without a trace. With a growing sense of urgency, the group debates whether to stay in this dreamlike existence or return to their chaotic lives. As the fog thickens, they experience surreal visions that challenge their deepest fears and desires.

Using voiceover, each character reflects on their motivations for wanting to escape or stay, leading to intense emotional confrontations among the group. In a climactic moment, they witness the island's true nature, forcing them to make a choice that reveals their true selves. The resolution sees them standing together at the edge of the fog, ready to face the uncertain reality of their lives, united in their decision to escape, but transformed by their experience.`
    }
  ];

  const handleStorylineChange = (storyline: AlternativeStoryline) => {
    setSelectedStoryline(storyline);
    setCharacterCount(storyline.fullStory.length);
  };

  const handleGenerateMore = () => {
    // This would integrate with an AI service to generate more storylines
    console.log('Generating more storylines...');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        {/* Project title and tags */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{projectData.title || 'Veil of Mist'}</h1>
          <div className="flex gap-2 flex-wrap">
            <Badge className="bg-black text-white hover:bg-zinc-800">Short Film</Badge>
            <Badge className="bg-black text-white hover:bg-zinc-800">Adventure</Badge>
            <Badge className="bg-black text-white hover:bg-zinc-800">Fantasy</Badge>
            <Badge className="bg-black text-white hover:bg-zinc-800">Self-Discovery</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Alternative Storylines - Now on the left */}
          <div className="md:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold mb-4 uppercase">Alternative Storylines</h2>
            
            {alternativeStorylines.map((storyline, index) => (
              <Card 
                key={index}
                className={`bg-black border-zinc-800 p-4 cursor-pointer hover:border-zinc-700 transition-colors ${
                  selectedStoryline === storyline ? 'border-blue-500' : ''
                }`}
                onClick={() => handleStorylineChange(storyline)}
              >
                <h3 className="font-medium mb-2">{storyline.title}</h3>
                <p className="text-sm text-zinc-400 mb-3">{storyline.description}</p>
                <div className="flex flex-wrap gap-2">
                  {storyline.tags.map((tag, tagIndex) => (
                    <Badge 
                      key={tagIndex} 
                      className="bg-zinc-900 text-xs text-zinc-400"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}

            <Button 
              variant="outline" 
              className="w-full bg-blue-950 border-blue-900 text-blue-400 hover:bg-blue-900"
              onClick={handleGenerateMore}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate more
            </Button>
          </div>

          {/* Main Storyline Editor - Now spans 2 columns */}
          <div className="md:col-span-2">
            <div className="bg-black rounded-lg border border-zinc-800 p-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-zinc-300 whitespace-pre-line">
                  {selectedStoryline ? selectedStoryline.fullStory : alternativeStorylines[0].fullStory}
                </p>
              </div>
              <div className="mt-4 text-right text-sm text-zinc-500">
                {characterCount || alternativeStorylines[0].fullStory.length} / 2000
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorylineTab;
