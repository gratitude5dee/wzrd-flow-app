
import { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Panel,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Connection,
  addEdge,
  EdgeTypes,
  NodeTypes,
  useReactFlow, // Import useReactFlow
} from 'reactflow';
import CustomEdge from './CustomEdge';
import RightSidebar from './RightSidebar';
import FlowControls from './flow/FlowControls';
import ImagesToVideoNode from './nodes/ImagesToVideoNode';
import TextToTextNode from './nodes/TextToTextNode';
import TextToImageNode from './nodes/TextToImageNode';
import { useWorkflow } from '@/hooks/useWorkflow';
// import { initialNodes, initialEdges } from '@/constants/flowConfig'; // Keep existing initialEdges if needed
import { initialEdges } from '@/constants/flowConfig'; // Use existing initialEdges
const initialNodes: Node[] = []; // Start with empty nodes for testing empty state
import { useToast } from '@/components/ui/use-toast';
import 'reactflow/dist/style.css';
import { MessageSquarePlus, Combine, Film, Zap, Search as SearchIcon } from 'lucide-react'; // Renamed Search to SearchIcon

const nodeTypes: NodeTypes = {
  imagesToVideo: ImagesToVideoNode,
  textToText: TextToTextNode,
  textToImage: TextToImageNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

const EmptyCanvasContent: React.FC = () => {
  const suggestionPills = [
    { text: "Describe an image", icon: <MessageSquarePlus size={16} className="mr-2" />, action: () => console.log("Suggest: Describe an image") },
    { text: "Combine ideas", icon: <Combine size={16} className="mr-2" />, action: () => console.log("Suggest: Combine ideas") },
    { text: "Make a video from an image", icon: <Film size={16} className="mr-2" />, action: () => console.log("Suggest: Make a video from an image") },
    { text: "Explore Flows", icon: <Zap size={16} className="mr-2" />, action: () => console.log("Suggest: Explore Flows") },
    { text: "...", icon: <SearchIcon size={16} className="mr-2" />, action: () => console.log("Suggest: More options") },
  ];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-10 z-10"> {/* Ensure z-index is high enough */}
      <h2 className="text-2xl font-medium text-gray-300 mb-3">
        Double-click anywhere to create a new Block, or start with...
      </h2>
      <div className="flex flex-wrap justify-center gap-3 pointer-events-auto">
        {suggestionPills.map((pill, index) => (
          <button
            key={index}
            onClick={pill.action}
            className="bg-zinc-700/50 hover:bg-zinc-600/70 border border-zinc-600/80 text-gray-200 hover:text-white text-sm font-medium py-2.5 px-5 rounded-full flex items-center transition-all duration-150 ease-in-out shadow-md hover:shadow-lg"
          >
            {pill.icon}
            {pill.text}
          </button>
        ))}
      </div>
    </div>
  );
};


const Canvas = () => {
  const [nodes, setNodesState, onNodesChange] = useNodesState(initialNodes); // Renamed setNodes to setNodesState to avoid conflict with reactflow instance
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const { saveWorkflow, loadWorkflow } = useWorkflow();
  const { toast } = useToast();
  const { getNodes, screenToFlowPosition } = useReactFlow(); // Get access to React Flow instance methods

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({ ...connection, type: 'custom' }, eds));
  }, [setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onNodeDataChange = useCallback((nodeId: string, data: any) => { // Renamed from onNodeChange to avoid conflict
    setNodesState((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      })
    );
  }, [setNodesState]);

  const handleSave = async () => {
    await saveWorkflow(getNodes(), edges); // Use getNodes() from useReactFlow for current state
  };

  const handleLoad = async (workflowId: string) => {
    const result = await loadWorkflow(workflowId);
    if (result) {
      const { nodes: loadedNodes, edges: loadedEdges } = result;
      setNodesState(loadedNodes);
      setEdges(loadedEdges);
      toast({
        title: "Success",
        description: "Workflow loaded successfully",
      });
    }
  };

  const currentNodes = getNodes();
  const showEmptyState = currentNodes.length === 0;

  const onPaneDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      // Placeholder: Log or open "Add Block" panel.
      // This might require lifting state up to Index.tsx to control activePanel.
      console.log('Pane double-clicked at flow position:', position);
      // Example: Add a default node
      // const newNodeId = `node_${+new Date()}`;
      // const newNode = {
      //   id: newNodeId,
      //   type: 'textToImage', // default node type
      //   position,
      //   data: { label: `New Node ${newNodeId}` },
      // };
      // setNodesState((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodesState]
  );

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 relative"> {/* This is where canvas-background from Index.tsx applies */}
        <ReactFlow
          nodes={nodes} // nodes from useNodesState
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          fitView={currentNodes.length > 0}
          defaultViewport={currentNodes.length === 0 ? { x: 0, y: 0, zoom: 1 } : { x:0, y:0, zoom: 1.5}} // Adjusted default viewport
          className="bg-transparent" // Make ReactFlow bg transparent to see the parent's dot grid
          minZoom={0.2}
          maxZoom={4}
          onDoubleClick={onPaneDoubleClick}
        >
          {/* Background component from ReactFlow for its own grid, if canvas-background is not sufficient or for layering */}
          {/* The main dot grid is on parent, this one can be different or removed */}
          <Background variant={"dots" as any} gap={20} size={1} color="rgba(255,255,255,0.07)" />
          <Controls className="!fill-white !stroke-white !text-white [&>button]:!bg-zinc-700/70 [&>button]:!border-zinc-600 hover:[&>button]:!bg-zinc-600/70" />
          <FlowControls onSave={handleSave} onLoad={handleLoad} />
          
          <Panel position="top-right" className="!absolute !right-[-256px] !top-auto !bottom-4 !w-56 !mx-4">
            <MiniMap 
              className="!bg-zinc-800/80 rounded-lg border border-zinc-700 backdrop-blur-sm"
              maskColor="rgba(0, 0, 0, 0.6)"
              nodeColor="#6b7280" // gray-500
              nodeStrokeColor="#4b5563" // gray-600
              nodeBorderRadius={4}
              style={{ height: 120 }}
              pannable
              zoomable
            />
          </Panel>
          {showEmptyState && <EmptyCanvasContent />}
        </ReactFlow>
      </div>
      <RightSidebar 
        selectedNode={selectedNode}
        onNodeChange={onNodeDataChange} // Pass renamed handler
      />
    </div>
  );
};

export default Canvas;
