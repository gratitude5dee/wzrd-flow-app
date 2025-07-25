
import React from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Copy, Image, Play, RefreshCw, MoreHorizontal } from 'lucide-react';

interface ShotCardProps {
  id: string;
  shotNumber: number;
}

const ShotCard = ({ id, shotNumber }: ShotCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-72 cursor-grab active:cursor-grabbing perspective"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <Card className="bg-[#0A0D16] border border-[#1D2130] rounded-lg overflow-hidden shadow-xl card-3d">
        <div className="aspect-video bg-[#0F1219] relative flex items-center justify-center group">
          <div className="absolute top-2 left-2">
            <span className="text-sm bg-black/60 px-2 py-1 rounded-full text-white">
              #{shotNumber}
            </span>
          </div>
          
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full bg-white/10 hover:bg-white/20 p-2 h-auto w-auto glow-icon-button"
              >
                <Edit className="w-4 h-4 text-white" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full bg-white/10 hover:bg-white/20 p-2 h-auto w-auto glow-icon-button"
              >
                <Copy className="w-4 h-4 text-white" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full bg-white/10 hover:bg-white/20 p-2 h-auto w-auto glow-icon-button"
              >
                <Image className="w-4 h-4 text-white" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full bg-white/10 hover:bg-white/20 p-2 h-auto w-auto glow-icon-button"
              >
                <Play className="w-4 h-4 text-white" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full bg-white/10 hover:bg-white/20 p-2 h-auto w-auto glow-icon-button"
              >
                <RefreshCw className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
          
          <div className="absolute top-2 right-2">
            <button className="text-white/70 hover:text-white">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-3 card-content">
          <div>
            <p className="text-xs text-zinc-500 uppercase mb-2 font-medium">Shot Type</p>
            <Select>
              <SelectTrigger className="bg-[#141824] border-[#2D3343] text-white h-8 text-sm">
                <SelectValue placeholder="Select shot type" />
              </SelectTrigger>
              <SelectContent className="bg-[#141824] border-[#2D3343] text-white">
                <SelectItem value="wide">Wide Shot</SelectItem>
                <SelectItem value="medium">Medium Shot</SelectItem>
                <SelectItem value="close">Close-up</SelectItem>
                <SelectItem value="extreme">Extreme Close-up</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <p className="text-xs text-zinc-500 uppercase mb-2 font-medium">Prompt</p>
            <Textarea 
              placeholder="Describe your shot..." 
              className="bg-[#141824] border-[#2D3343] text-white min-h-[60px] rounded-md text-sm resize-none"
            />
          </div>
          
          <div>
            <p className="text-xs text-zinc-500 uppercase mb-2 font-medium">Character Dialogue</p>
            <Input 
              placeholder="Add character dialogue..." 
              className="bg-[#141824] border-[#2D3343] text-white rounded-md h-8 text-sm"
            />
          </div>
          
          <div>
            <p className="text-xs text-zinc-500 uppercase mb-2 font-medium">Sound Effects</p>
            <Input 
              placeholder='E.g., "Ocean waves..."' 
              className="bg-[#141824] border-[#2D3343] text-white rounded-md h-8 text-sm"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ShotCard;
