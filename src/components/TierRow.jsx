import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

const TierRow = ({ id, label, color, items }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex min-h-[100px] border-b border-gray-200 dark:border-gray-800 last:border-b-0 transition-colors duration-300">
      <div className={`${color} w-32 flex items-center justify-center p-2 text-center text-black font-bold text-sm uppercase`}>
        {label}
      </div>
      <div ref={setNodeRef} className="flex-1 flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-black/40 min-w-[200px] transition-colors duration-300">
        <SortableContext items={items.map(i => i.id)} strategy={horizontalListSortingStrategy}>
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} src={item.src} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default TierRow;
