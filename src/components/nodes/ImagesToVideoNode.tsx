
import { memo, useState } from 'react';
// import { Handle, Position } from 'reactflow'; // Handles are now in BaseNodeWrapper
import BaseNodeWrapper, { CustomNodeProps, BaseNodeData } from './BaseNodeWrapper';
import { Upload, CircleDashed, Coins, PlaySquare, Settings2, FileImage } from 'lucide-react'; // PlaySquare for video icon
import { useCredits } from '@/hooks/useCredits';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export interface ImagesToVideoNodeData extends BaseNodeData {
  images?: (string | null)[]; // Array of image URLs or nulls
  prompt?: string;
  generatedVideo?: string | null; // URL of the generated video
}

const MAX_IMAGES = 9; // As per original grid

const ImagesToVideoNode = memo((props: CustomNodeProps<ImagesToVideoNodeData>) => {
  const { data } = props;

  const [images, setImages] = useState<(string | null)[]>(data.images || Array(MAX_IMAGES).fill(null));
  const [prompt, setPrompt] = useState(data.prompt || '');
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(data.generatedVideo || null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { useCredits: useCreditsFn, availableCredits } = useCredits();
  const { user } = useAuth();

  const examplePromptText = "A dynamic slideshow of these images with upbeat music.";

  const handleImageUpload = (index: number) => {
    // Placeholder: Trigger file input or connect to an asset manager
    // For demonstration, let's simulate adding a placeholder image URL
    const newImages = [...images];
    if (newImages[index]) {
      newImages[index] = null; // Click again to remove
    } else {
      newImages[index] = `https://via.placeholder.com/100?text=Img${index + 1}`; // Placeholder image
    }
    setImages(newImages);
    // props.onDataChange?.({ ...data, images: newImages });
    console.log('Upload/toggle image at index:', index);
  };

  const handleGenerate = async () => {
    const uploadedImages = images.filter(img => img !== null);
    if (uploadedImages.length < 2) {
      toast.error('Please provide at least 2 images');
      return;
    }
    if (!user) {
      toast.error('Please log in to generate videos');
      return;
    }
    if (availableCredits < 2) { // Assuming video costs 2 credits
      toast.error('You need at least 2 credits to generate videos.');
      return;
    }
    
    const creditUsed = await useCreditsFn('video', 2, { 
      prompt: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
      imageCount: uploadedImages.length
    });
    
    if (!creditUsed) return;
    
    setIsGenerating(true);
    setGeneratedVideo(null);
    // TODO: Implement actual video generation API call
    console.log("Generating video with images:", uploadedImages, "and prompt:", prompt);
    // Simulate API call
    setTimeout(() => {
      setGeneratedVideo("https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"); // Placeholder video URL
      // props.onDataChange?.({ ...data, generatedVideo: "placeholder_video_url" });
      setIsGenerating(false);
      toast.success("Video generation started (simulation).");
    }, 3000);
  };

  const currentBlockType = data.blockType || "VIDEO";
  const currentModelName = data.modelName || "SVD 1.1"; // Example video model

  return (
    <BaseNodeWrapper {...props} data={{ ...data, blockType: currentBlockType, modelName: currentModelName, learnMoreLink: "#learn-video-nodes" }} >
      <div className="space-y-3">
        {/* "Try to..." Text Input Area for prompt/instructions */}
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`Try to describe the video, e.g., '${examplePromptText}'`}
          className="w-full min-h-[60px] p-2.5 bg-zinc-700/60 border-zinc-600/80 placeholder-gray-400/70 text-gray-100 rounded-md focus:bg-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        {/* Image Grid for uploads */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((imageSrc, index) => (
            <button
              key={index}
              onClick={() => handleImageUpload(index)}
              title={imageSrc ? "Click to remove image" : "Click to upload image"}
              className={`aspect-square bg-zinc-700/40 border border-zinc-600/50 rounded-md flex items-center justify-center cursor-pointer hover:bg-zinc-600/60 hover:border-zinc-500 transition-colors group relative overflow-hidden ${imageSrc ? 'border-green-500/50 hover:border-red-500/50' : ''}`}
            >
              {imageSrc ? (
                <img src={imageSrc} alt={`Frame ${index + 1}`} className="w-full h-full object-cover" />
              ) : (
                <FileImage size={20} className="text-gray-500 group-hover:text-gray-400" />
              )}
               {!imageSrc && <span className="absolute bottom-1 right-1 text-[9px] text-gray-500 group-hover:text-gray-400">{index+1}</span>}
            </button>
          ))}
        </div>

        {/* Action buttons if any (e.g., advanced video settings) */}
         <Button variant="outline" size="sm" className="w-full justify-start bg-zinc-700/40 hover:bg-zinc-600/60 border-zinc-600/70 text-gray-300 hover:text-white transition-colors">
            <Settings2 size={15} className="mr-2.5 text-gray-400" />
            Video settings (e.g., duration, FPS)
        </Button>

        {/* Video Preview Area */}
        <div className="aspect-video bg-zinc-700/40 rounded-lg overflow-hidden border border-zinc-600/50 flex items-center justify-center text-gray-500">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <CircleDashed className="w-8 h-8 animate-spin text-gray-400" />
              <span className="text-sm text-gray-400">Generating video...</span>
            </div>
          ) : generatedVideo ? (
            <video src={generatedVideo} controls className="w-full h-full object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-2 p-4 text-center">
                <PlaySquare size={32} />
                <span>Video preview will appear here</span>
            </div>
          )}
        </div>

        {(prompt === '' || !prompt) && images.every(img => img === null) && (
          <div className="mt-1 px-1 py-0.5">
            <p className="text-xs text-gray-500/80 italic">
              Example: Upload images and describe the desired video output.
            </p>
          </div>
        )}

        {/* Generate Button & Credits */}
        <div className="flex items-center justify-between pt-2 mt-1 border-t border-zinc-700/60">
          <div className="flex items-center gap-1 text-zinc-400 text-xs">
            <Coins className="h-3.5 w-3.5 text-yellow-500/80" />
            <span>2 credits</span> {/* Assuming 2 credits for video */}
          </div>
          <Button
            onClick={handleGenerate}
            disabled={images.filter(img => img !== null).length < 2 || isGenerating || !user || availableCredits < 2}
            size="sm"
            className="bg-teal-600 hover:bg-teal-500 text-white font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <CircleDashed className="w-4 h-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              'Generate Video'
            )}
          </Button>
        </div>
      </div>
    </BaseNodeWrapper>
  );
});

ImagesToVideoNode.displayName = 'ImagesToVideoNode';
export default ImagesToVideoNode;
