import React, { useState, useRef, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Download, Share2, Sun, Moon } from 'lucide-react';
import html2canvas from 'html2canvas';

import TierRow from './components/TierRow';
import ItemBank from './components/ItemBank';
import { SortableItem, Item } from './components/SortableItem';

const TIERS = [
  { id: 'S', label: 'S (I LOVE IT)', color: 'bg-[#15803d]' },
  { id: 'A', label: 'A (GOOD)', color: 'bg-[#22c55e]' },
  { id: 'B', label: 'B (NOT BAD)', color: 'bg-[#4ade80]' },
  { id: 'D', label: 'D (NOT MINE)', color: 'bg-[#86efac]' },
  { id: 'C', label: 'C (BAD)', color: 'bg-[#bbf7d0]' },
  { id: 'SKIP', label: 'SKIP', color: 'bg-[#dcfce7]' },
];

// Automatically import all images from src/assets/projects
const projectImages = import.meta.glob('./assets/projects/*.{png,jpg,jpeg,svg,webp}', { eager: true, as: 'url' });

// Create items from the imported images
const INITIAL_ITEMS = Object.values(projectImages).map((src, index) => ({
  id: `project-${index}`,
  src: src,
  container: 'bank',
}));

function App() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [activeId, setActiveId] = useState(null);
  const [theme, setTheme] = useState('dark');
  const tierListRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeItem = items.find((item) => item.id === activeId);
    const overItem = items.find((item) => item.id === overId);
    
    if (!activeItem) return;

    // Dropping over a container (tier row or bank)
    if (TIERS.some(t => t.id === overId) || overId === 'bank') {
        const newContainer = overId;
        if (activeItem.container !== newContainer) {
            setItems((items) => {
                return items.map(item => 
                    item.id === activeId ? { ...item, container: newContainer } : item
                );
            });
        }
    } 
    // Dropping over another item
    else if (overItem) {
        if (activeItem.container !== overItem.container) {
             setItems((items) => {
                return items.map(item => 
                    item.id === activeId ? { ...item, container: overItem.container } : item
                );
            });
        }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const activeId = active.id;
    const overId = over ? over.id : null;

    if (activeId !== overId && overId) {
       const activeIndex = items.findIndex((i) => i.id === activeId);
       const overIndex = items.findIndex((i) => i.id === overId);
       
       if (activeIndex !== -1 && overIndex !== -1) {
            // Only reorder if in same container
            if (items[activeIndex].container === items[overIndex].container) {
                 setItems((items) => arrayMove(items, activeIndex, overIndex));
            }
       }
    }

    setActiveId(null);
  };

  const handleDownload = async () => {
    if (!tierListRef.current) return;
    try {
      const canvas = await html2canvas(tierListRef.current, {
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = 'tier-list.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error('Failed to capture screenshot', err);
    }
  };

  const handleShare = async () => {
     await handleDownload();
     
     const text = "Check out my tier list! Create yours here.";
     const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
     window.open(url, '_blank');
  };

  const activeItem = activeId ? items.find((i) => i.id === activeId) : null;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-[#121212] dark:text-white p-8 font-sans transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold">
                <span className="text-green-600 dark:text-green-500">Abstract</span> Project Tier List
              </h1>
              <a 
                href="https://x.com/nftgoy" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-colors mt-1 font-medium"
              >
                Built by @nftgoy
              </a>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                <Download size={20} />
                <span>Save Image</span>
              </button>
               <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-black text-white border border-gray-600 rounded hover:bg-gray-800 transition"
              >
                <Share2 size={20} />
                <span>Share on X</span>
              </button>
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={rectIntersection}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div ref={tierListRef} className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden transition-colors duration-300">
              {TIERS.map((tier) => (
                <TierRow 
                  key={tier.id} 
                  id={tier.id} 
                  label={tier.label} 
                  color={tier.color}
                  items={items.filter(i => i.container === tier.id)} 
                />
              ))}
            </div>

            <ItemBank 
            id="bank" 
            items={items.filter(i => i.container === 'bank')} 
          />

          <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({}) }}>
            {activeItem ? <Item src={activeItem.src} dragging /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

export default App;
