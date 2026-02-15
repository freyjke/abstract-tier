import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
        <Item src={props.src} />
    </div>
  );
}

export function Item({ src, dragging }) {
    return (
        <div 
            className={`
                w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-md overflow-hidden border-2 flex-shrink-0
                ${dragging ? 'border-blue-500 shadow-xl' : 'border-transparent hover:border-gray-400 dark:hover:border-gray-500'}
                transition-all duration-200 cursor-grab active:cursor-grabbing
            `}
        >
            <img 
                src={src} 
                alt="Project" 
                className="w-full h-full object-cover pointer-events-none" 
                crossOrigin="anonymous"
            />
        </div>
    )
}
