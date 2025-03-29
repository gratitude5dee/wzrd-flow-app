
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export interface Scene {
  id: number;
  title: string;
  description: string;
  sceneDescription: string;
  voiceover: string;
  location: string;
  lighting: string;
  weather: string;
}

interface SceneEditDialogProps {
  scene: Scene;
  open: boolean;
  onClose: () => void;
  onSave: (scene: Scene) => void;
}

export const SceneEditDialog = ({ scene, open, onClose, onSave }: SceneEditDialogProps) => {
  const [editedScene, setEditedScene] = useState<Scene>(scene);

  const handleChange = (field: keyof Scene, value: string) => {
    setEditedScene(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(editedScene);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#1A1C26] text-white border-[#2A3558] max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Scene</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add details to help visualize your scene better.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Scene Title</Label>
            <Input
              id="title"
              value={editedScene.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="bg-[#0F1526] border-[#2A3558]"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Brief Description</Label>
            <Textarea
              id="description"
              value={editedScene.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="bg-[#0F1526] border-[#2A3558]"
              rows={2}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sceneDescription">Scene Description</Label>
            <Textarea
              id="sceneDescription"
              value={editedScene.sceneDescription}
              onChange={(e) => handleChange('sceneDescription', e.target.value)}
              className="bg-[#0F1526] border-[#2A3558]"
              rows={4}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="voiceover">Voiceover</Label>
            <Textarea
              id="voiceover"
              value={editedScene.voiceover}
              onChange={(e) => handleChange('voiceover', e.target.value)}
              className="bg-[#0F1526] border-[#2A3558]"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editedScene.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="bg-[#0F1526] border-[#2A3558]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="lighting">Lighting</Label>
              <Input
                id="lighting"
                value={editedScene.lighting}
                onChange={(e) => handleChange('lighting', e.target.value)}
                className="bg-[#0F1526] border-[#2A3558]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="weather">Weather</Label>
              <Input
                id="weather"
                value={editedScene.weather}
                onChange={(e) => handleChange('weather', e.target.value)}
                className="bg-[#0F1526] border-[#2A3558]"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="bg-transparent text-white border-[#2A3558] hover:bg-[#2A3558]"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-[#3B55E6] hover:bg-[#2E44B8]"
          >
            Save Scene
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
