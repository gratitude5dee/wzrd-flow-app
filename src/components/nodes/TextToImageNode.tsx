import React, { memo, useState, useCallback } from 'react';
// import { Handle, Position, useReactFlow } from 'reactflow'; // Handles are now in BaseNodeWrapper
import { useReactFlow } from 'reactflow'; // Keep for deleteElements if needed elsewhere, or remove if BaseNodeWrapper handles all
import BaseNodeWrapper, { CustomNodeProps, BaseNodeData } from './BaseNodeWrapper';
import { CircleDashed, Coins, Settings2, UploadCloud } from 'lucide-react'; // X (delete) is handled by React Flow or BaseNodeWrapper if custom
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast as useShadcnToast } from '@/hooks/use-toast'; // Renamed to avoid conflict
import { supabase } from '@/integrations/supabase/client';
import { useCredits } from '@/hooks/useCredits';
import { toast as sonnerToast } from 'sonner'; // Renamed to avoid conflict
import { useAuth } from '@/providers/AuthProvider';

// Define specific data structure for TextToImageNode, extending BaseNodeData
export interface TextToImageNodeData extends BaseNodeData {
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: AspectRatioOption;
  style?: StyleOption;
  generatedImage?: string | null;
  // id is part of NodeProps, not data usually
}

type AspectRatioOption = "1:1" | "16:9" | "9:16" | "4:3" | "3:4" | "3:2" | "2:3";
type StyleOption = "auto" | "general" | "realistic" | "design" | "render_3D" | "anime";

const ASPECT_RATIOS: AspectRatioOption[] = ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3"];
const STYLES: StyleOption[] = ["auto", "general", "realistic", "design", "render_3D", "anime"];

const TextToImageNode = memo((props: CustomNodeProps<TextToImageNodeData>) => {
  const { id, data, ...restProps } = props;

  // Initialize state from data or defaults
  const [prompt, setPrompt] = useState(data.prompt || '');
  const [negativePrompt, setNegativePrompt] = useState(data.negativePrompt || '');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>(data.aspectRatio || "1:1");
  const [style, setStyle] = useState<StyleOption>(data.style || "auto");
  const [generatedImage, setGeneratedImage] = useState<string | null>(data.generatedImage || null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const { deleteElements } = useReactFlow(); // If specific delete logic inside node is needed beyond default
  const { toast: shadcnToast } = useShadcnToast();
  const { user } = useAuth();
  const { useCredits: useCreditsFn, availableCredits } = useCredits();

  // Example default prompt for the placeholder text
  const examplePromptText = "A cat astronaut on the moon, detailed, cinematic lighting";


  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    if (!user) {
      shadcnToast({
        title: "Authentication Required",
        description: "Please log in to generate images",
        variant: "destructive",
      });
      return;
    }
    
    if (availableCredits === 0) {
      shadcnToast({
        title: "No Credits Available",
        description: "You need credits to generate images. Visit the credits page to get more.",
        variant: "destructive",
      });
      return;
    }
    
    const creditUsed = await useCreditsFn('image', 1, { 
      prompt: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
      style,
      aspectRatio
    });
    
    if (!creditUsed) return;
    
    setIsGenerating(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Authentication required');

      const supabaseUrl = "https://ixkkrousepsiorwlaycp.supabase.co";
      const response = await fetch(`${supabaseUrl}/functions/v1/fal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({
          modelId: 'fal-ai/ideogram/v2',
          input: { prompt, negative_prompt: negativePrompt, aspect_ratio: aspectRatio, style, expand_prompt: true },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try { throw new Error(JSON.parse(errorText).error || `Failed to generate image: ${errorText}`); }
        catch (e) { throw new Error(`Failed to generate image: ${errorText}`); }
      }

      const resData = await response.json();
      
      if (resData.requestId) {
        let attempts = 0; const maxAttempts = 30;
        while (attempts < maxAttempts) {
          const pollResponse = await fetch(`${supabaseUrl}/functions/v1/fal-poll`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
            body: JSON.stringify({ requestId: resData.requestId }),
          });
          if (!pollResponse.ok) throw new Error('Failed to check generation status');
          const pollData = await pollResponse.json();
          if (pollData.status === 'COMPLETED' && pollData.result?.images?.[0]?.url) {
            setGeneratedImage(pollData.result.images[0].url);
            // props.onDataChange?.({ ...data, generatedImage: pollData.result.images[0].url }); // Update central state
            break;
          } else if (pollData.status === 'FAILED') throw new Error('Image generation failed');
          await new Promise(resolve => setTimeout(resolve, 2000));
          attempts++;
        }
        if (attempts >= maxAttempts) throw new Error('Generation timed out');
      } else if (resData.images?.[0]?.url) {
        setGeneratedImage(resData.images[0].url);
        // props.onDataChange?.({ ...data, generatedImage: resData.images[0].url }); // Update central state
      } else {
        throw new Error('No image URL received');
      }
      sonnerToast.success("Image generated successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate image';
      console.error('Generation error:', err);
      setError(message);
      sonnerToast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentBlockType = data.blockType || "IMAGE";
  const currentModelName = data.modelName || "Ideogram v2";

  return (
    <BaseNodeWrapper {...props} data={{ ...data, blockType: currentBlockType, modelName: currentModelName, learnMoreLink: "#learn-image-nodes" }}>
      <div className="space-y-3">
        {/* "Try to..." Text Input Area */}
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`Try to describe an image, e.g., '${examplePromptText}'`}
          className="w-full min-h-[70px] p-2.5 bg-zinc-700/60 border-zinc-600/80 placeholder-gray-400/70 text-gray-100 rounded-md focus:bg-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        {/* Generated Image Display */}
        <div className="aspect-video bg-zinc-700/40 rounded-lg overflow-hidden border border-zinc-600/50">
          {generatedImage ? (
            <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs p-2">
              {error ? <span className="text-red-400/80 text-sm px-2 text-center">{error}</span> : 'Generated image will appear here'}
            </div>
          )}
        </div>

        {/* List of actions/settings */}
        <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start bg-zinc-700/40 hover:bg-zinc-600/60 border-zinc-600/70 text-gray-300 hover:text-white transition-colors">
                <UploadCloud size={15} className="mr-2.5 text-gray-400" />
                Upload reference image (optional)
            </Button>
            {/* Could make advanced settings collapsible */}
            <Disclosure>
                <DisclosureButton variant="outline" size="sm" className="w-full justify-start bg-zinc-700/40 hover:bg-zinc-600/60 border-zinc-600/70 text-gray-300 hover:text-white transition-colors">
                    <Settings2 size={15} className="mr-2.5 text-gray-400" />
                    Advanced settings
                </DisclosureButton>
                <DisclosurePanel className="pt-2 pb-1 space-y-3 bg-zinc-700/20 px-2.5 rounded-b-md border border-t-0 border-zinc-600/70">
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
                        <div>
                            <label className="text-xs font-medium text-gray-400 block mb-1">Style</label>
                            <Select value={style} onValueChange={(value) => setStyle(value as StyleOption)}>
                                <SelectTrigger className="w-full bg-zinc-600/50 text-gray-200 border-zinc-500/70 text-xs h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-700 text-gray-200 border-zinc-600">
                                    {STYLES.map((s) => <SelectItem key={s} value={s} className="text-xs hover:bg-zinc-600">{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-400 block mb-1">Aspect Ratio</label>
                            <Select value={aspectRatio} onValueChange={(value) => setAspectRatio(value as AspectRatioOption)}>
                                <SelectTrigger className="w-full bg-zinc-600/50 text-gray-200 border-zinc-500/70 text-xs h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-700 text-gray-200 border-zinc-600">
                                    {ASPECT_RATIOS.map((ratio) => <SelectItem key={ratio} value={ratio} className="text-xs hover:bg-zinc-600">{ratio}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-400 block mb-1">Negative Prompt</label>
                        <Textarea
                            value={negativePrompt}
                            onChange={(e) => setNegativePrompt(e.target.value)}
                            placeholder="e.g., blurry, text, watermark"
                            className="w-full min-h-[50px] p-2 bg-zinc-600/50 border-zinc-500/70 placeholder-gray-500 text-gray-200 rounded-md text-xs focus:bg-zinc-600 focus:border-blue-500"
                        />
                    </div>
                </DisclosurePanel>
            </Disclosure>
        </div>

        {/* Example Prompt Display */}
        {(prompt === '' || !prompt) && (
          <div className="mt-1 px-1 py-0.5">
            <p className="text-xs text-gray-500/80 italic">
              Example: {examplePromptText}
            </p>
          </div>
        )}

        {/* Generate Button & Credits */}
        <div className="flex items-center justify-between pt-2 mt-1 border-t border-zinc-700/60">
          <div className="flex items-center gap-1 text-zinc-400 text-xs">
            <Coins className="h-3.5 w-3.5 text-yellow-500/80" />
            <span>1 credit</span>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating || !user || availableCredits === 0}
            size="sm"
            className="bg-teal-600 hover:bg-teal-500 text-white font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <CircleDashed className="w-4 h-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              'Generate Image'
            )}
          </Button>
        </div>
      </div>
    </BaseNodeWrapper>
  );
});

// Temporary import for Disclosure while Headless UI is not fully integrated
// This is a simplified stand-in. For real use, install @headlessui/react
const DisclosureContext = React.createContext<{ open: boolean; close: () => void } | null >(null);
function useDisclosureContext(component: string) {
    let context = React.useContext(DisclosureContext);
    if (context === null) {
        throw new Error(`<${component} /> is missing a parent <Disclosure /> component.`);
    }
    return context;
}
const Disclosure = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { defaultOpen?: boolean }>(
    function Disclosure(props, ref) {
        const { defaultOpen = false, ...theirProps } = props;
        const [open, setOpen] = useState(defaultOpen);
        const close = useCallback(() => setOpen(false), []);
        const context = React.useMemo(() => ({ open, close, setOpen }), [open, close]);

        const ourProps = {
            ref,
            onClick: () => context.setOpen(!context.open), // Toggle on click for the main container too if needed
        };
        return <DisclosureContext.Provider value={context}><div {...theirProps} {...ourProps} /></DisclosureContext.Provider>;
    }
);

const DisclosureButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }>(
    function DisclosureButton(props, ref) {
        const { open, setOpen } = useDisclosureContext("DisclosureButton") as any;
        const { variant, size, className = '', ...theirProps } = props;

        const ourProps = {
            ref,
            onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                setOpen(!open);
                props.onClick?.(e);
            },
            'aria-expanded': open,
            className: `${className} inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-transparent hover:bg-accent hover:text-accent-foreground h-9 px-3`,
        };
        return <button {...theirProps} {...ourProps} />;
    }
);

const DisclosurePanel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    function DisclosurePanel(props, ref) {
        const { open } = useDisclosureContext("DisclosurePanel");
        if (!open) return null;
        return <div ref={ref} {...props} />;
    }
);


TextToImageNode.displayName = 'TextToImageNode';
export default TextToImageNode;
