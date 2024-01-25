'use client'

import { Draggable } from '@hello-pangea/dnd'
import { Card } from '@prisma/client'

interface CardItemProps {
  data: Card
  index: number
}

export const CardItem = ({ data, index }: CardItemProps) => {
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          role='button'
          className='truncate border-2 border-transparent hover:border-black/75
py-2 px-3 text-sm bg-white rounded-md shadow-sm'
        >
          {data.title}
        </div>
      )}
    </Draggable>
  )
}
