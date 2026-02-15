import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

const ItemBank = ({ id, items }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">Unranked Projects</h3>
      </div>
      
      <div 
        ref={setNodeRef} 
        className="min-h-[150px] p-4 bg-white dark:bg-[#1a1a1a] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-wrap gap-3 transition-colors duration-300"
      >
        <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
          {items.length === 0 ? (
             <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 min-h-[120px]">
                <p>No projects available to rank</p>
             </div>
          ) : (
            items.map((item) => (
              <SortableItem key={item.id} id={item.id} src={item.src} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default ItemBank;
