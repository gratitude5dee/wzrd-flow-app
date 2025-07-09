import React from 'react';
import CommunitySidebar from '../components/community/CommunitySidebar';
import ContentCard from '../components/community/ContentCard';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

// Placeholder data for cards
const placeholderTutorials = [
  { id: 'tut1', thumbnailUrl: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=300&q=70', category: 'Tutorial', duration: '12 min', title: 'Mastering Node Connections', authorName: 'FlowMaster Flex' },
  { id: 'tut2', thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726c?auto=format&fit=crop&w=300&q=70', category: 'Guide', duration: '8 min', title: 'Advanced Styling Techniques', authorName: 'Visual Virtuoso' },
  { id: 'tut3', thumbnailUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=300&q=70', category: 'Tutorial', duration: '15 min', title: 'Creating Complex Workflows', authorName: 'Logic Lord' },
  { id: 'tut4', thumbnailUrl: 'https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=300&q=70', category: 'Quick Tip', duration: '3 min', title: 'Optimizing Performance', authorName: 'Speedy Steve' },
];

const placeholderEditorsChoice = [
  { id: 'ec1', thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=70', category: 'Flow', duration: 'Showcase', title: 'Abstract Particle System', authorName: 'ArtisticAI' },
  { id: 'ec2', thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=300&q=70', category: 'Animation', duration: 'Demo', title: 'Morphing Shapes Animation', authorName: 'Motion Maven' },
  { id: 'ec3', thumbnailUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=300&q=70', category: 'Utility', duration: 'Tool', title: 'Dynamic Data Visualizer', authorName: 'Data Dynamo' },
  { id: 'ec4', thumbnailUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&q=70', category: 'Experiment', duration: 'Fun', title: 'Interactive Story Generator', authorName: 'Narrative AI' },
];


const HorizontallyScrollableSection: React.FC<{ title: string; items: any[]; CardComponent: React.ElementType }> = ({ title, items, CardComponent }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-2xl font-semibold text-gray-100">{title}</h2>
        <div className="flex space-x-2">
          <button onClick={() => scroll('left')} className="p-1.5 bg-zinc-700/70 hover:bg-zinc-600/70 rounded-full text-gray-300 hover:text-white transition-colors disabled:opacity-50" aria-label={`Scroll ${title} left`}>
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scroll('right')} className="p-1.5 bg-zinc-700/70 hover:bg-zinc-600/70 rounded-full text-gray-300 hover:text-white transition-colors disabled:opacity-50" aria-label={`Scroll ${title} right`}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex space-x-5 overflow-x-auto pb-4 scrollbar-hide">
        {items.map((item) => (
          <CardComponent key={item.id} {...item} />
        ))}
      </div>
       {/* Custom scrollbar styling (optional, if scrollbar-hide is not enough or for browsers that don't support it) */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </section>
  );
};


const CommunityPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#0F1117] text-white overflow-hidden">
      <CommunitySidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">Discover new techniques & inspiration</h1>
          <p className="text-gray-400 text-lg">Explore tutorials, flows, and assets shared by the WZRDFLOW community.</p>
        </header>

        <div className="relative mb-10 max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search community content (e.g., 'character rigging', 'sci-fi landscapes')..."
            className="w-full bg-zinc-800/60 text-white placeholder-gray-500 pl-12 pr-4 py-3.5 rounded-xl border border-zinc-700/80 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 transition-all text-base"
          />
        </div>

        <HorizontallyScrollableSection title="Tutorials" items={placeholderTutorials} CardComponent={ContentCard} />
        <HorizontallyScrollableSection title="Editor's Choice" items={placeholderEditorsChoice} CardComponent={ContentCard} />

        {/* Add more sections as needed */}
      </main>
    </div>
  );
};

export default CommunityPage;
