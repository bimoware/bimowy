import React, { ReactNode } from 'react';
import {useDroppable} from '@dnd-kit/core';

export default function Droppable({ children }: { children: ReactNode}) {
  const {isOver, setNodeRef} = useDroppable({
    id: 'droppable',
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };
  
  
  return (
    <div ref={setNodeRef} style={style} className='bg-blue-500/10'>
      {children}
    </div>
  );
}