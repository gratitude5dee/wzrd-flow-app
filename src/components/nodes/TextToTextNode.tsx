import { memo, useState, useEffect } from 'react';
// import { Handle, Position, useReactFlow } from 'reactflow'; // Handles are now in BaseNodeWrapper
// import { X, Loader2, Coins } from 'lucide-react'; // X is handled by RF, Loader2 can be CircleDashed or similar, Coins is kept
import { Loader2, Coins } from 'lucide-react'; // Loader2 for spinner, Coins for credits
import BaseNodeWrapper, { CustomNodeProps, BaseNodeData } from './BaseNodeWrapper';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast as useShadcnToast } from '@/components/ui/use-toast'; // Renamed to avoid conflict
import { models as textModels, ModelType as TextModelType } from '@/types/modelTypes'; // Assuming models are for text
import { generateText } from '@/services/textGeneration';
import { useAuth } from "@/providers/AuthProvider";
import { useCredits } from '@/hooks/useCredits';
// import { toast } from 'sonner'; // sonner toast not used in original, stick to shadcn toast if that's the pattern

export interface TextToTextNodeData extends BaseNodeData {
  prompt?: string;
  output?: string;
  selectedModel?: TextModelType;
}

const TextToTextNode = memo((props: CustomNodeProps<TextToTextNodeData>) => {
  const { data } = props;

  const [prompt, setPrompt] = useState(data.prompt || '');
  const [output, setOutput] = useState(data.output || '');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState<TextModelType>(data.selectedModel || textModels[0].value);

  const { toast: shadcnToast } = useShadcnToast();
  const { user } = useAuth();
  // const { deleteElements } = useReactFlow(); // Only if custom delete inside node is needed
  const { useCredits: useCreditsFn, availableCredits } = useCredits();

  const examplePromptText = "Summarize this article for a 5th grader: [paste article]";

  useEffect(() => {
    if (!user) {
      shadcnToast({
        title: "Authentication Required",
        description: "Please ensure you're logged in to use the AI features.",
        variant: "destructive",
      });
    }
  }, [user, shadcnToast]);

  // ResizeObserver error handling (from original)
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message === 'ResizeObserver loop limit exceeded') {
        event.preventDefault(); // Keep this if it's a known issue in the project
      }
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);


  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    if (!user) {
      setError('Please log in to use the AI features');
      shadcnToast({
        title: "Authentication Required",
        description: "Please log in to use the AI features.",
        variant: "destructive",
      });
      return;
    }
    
    if (availableCredits === 0) {
      setError('You need credits to generate text');
      shadcnToast({
        title: "No Credits Available",
        description: "You need credits to generate text. Visit the credits page to get more.",
        variant: "destructive",
      });
      return;
    }
    
    const creditUsed = await useCreditsFn('text', 1, { 
      prompt: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
      model: selectedModel
    });
    
    if (!creditUsed) return;
    
    setIsGenerating(true);
    setError('');
    setOutput('');

    try {
      const result = await generateText(prompt, selectedModel);
      const newOutput = result.data?.output || result.output || 'No output received.';
      setOutput(newOutput);
      // props.onDataChange?.({ ...data, output: newOutput, prompt, selectedModel }); // Update central state
    } catch (err: any) {
      console.error('Error during generation:', err);
      const errorMessage = err.message || 'Failed to generate text. Please try again.';
      setError(errorMessage);
      shadcnToast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const currentBlockType = data.blockType || "TEXT";
  // Determine model name for display in header; find label from textModels
  const currentModelLabel = textModels.find(m => m.value === selectedModel)?.label || selectedModel;
  const currentModelName = data.modelName || currentModelLabel || "GPT-4o Mini";


  return (
    <BaseNodeWrapper {...props} data={{ ...data, blockType: currentBlockType, modelName: currentModelName, learnMoreLink: "#learn-text-nodes" }}>
      <div className="space-y-3">
        {/* "Try to..." Text Input Area */}
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`Try to ask for a text response, e.g., '${examplePromptText}'`}
          className="w-full min-h-[70px] p-2.5 bg-zinc-700/60 border-zinc-600/80 placeholder-gray-400/70 text-gray-100 rounded-md focus:bg-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        {/* Model Selector - as an "action" or setting */}
        <div>
            <label className="text-xs font-medium text-gray-400 block mb-1">Model</label>
            <Select
                value={selectedModel}
                onValueChange={(value: TextModelType) => setSelectedModel(value)}
            >
                <SelectTrigger className="w-full bg-zinc-700/40 hover:bg-zinc-600/60 border-zinc-600/70 text-gray-300 hover:text-white transition-colors h-9 text-sm">
                    <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-700 text-gray-200 border-zinc-600">
                    {textModels.map((model) => (
                        <SelectItem key={model.value} value={model.value} className="text-sm hover:bg-zinc-600">
                            {model.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        {/* Output Area */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-400">Output</label>
          <div className="w-full min-h-[100px] bg-zinc-700/40 border border-zinc-600/50 text-gray-200 text-sm p-2.5 rounded-md overflow-y-auto pretty-scrollbar">
            {error ? (
              <p className="text-red-400/80">{error}</p>
            ) : output ? (
              <pre className="whitespace-pre-wrap break-words font-sans text-sm">{output}</pre>
            ) : (
              <span className="text-gray-500">Generated text will appear here...</span>
            )}
          </div>
        </div>

        {(prompt === '' || !prompt) && !output && (
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
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              'Generate Text'
            )}
          </Button>
        </div>
      </div>
      <style>{`
        .pretty-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .pretty-scrollbar::-webkit-scrollbar-track {
          background: rgba(74, 85, 104, 0.3); /* zinc-600/30 */
          border-radius: 3px;
        }
        .pretty-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(113, 128, 150, 0.7); /* zinc-500/70 */
          border-radius: 3px;
        }
        .pretty-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(113, 128, 150, 1); /* zinc-500 */
        }
      `}</style>
    </BaseNodeWrapper>
  );
});

TextToTextNode.displayName = 'TextToTextNode';
export default TextToTextNode;
